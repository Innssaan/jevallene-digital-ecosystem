import crypto from 'node:crypto';
import cors from 'cors';
import express from 'express';
import { readDb, writeDb } from './store.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const startedAt = Date.now();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

function parseCookies(cookieHeader = '') {
  const map = {};
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) map[k] = decodeURIComponent(rest.join('='));
  }
  return map;
}

function createOAuthSession(provider, profile) {
  const db = readDb();
  let user = db.users.find((u) => u.email === profile.email && u.provider === provider);
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      provider,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar || null,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    user.name = profile.name;
    user.avatar = profile.avatar || user.avatar;
  }

  const session = {
    sid: crypto.randomBytes(24).toString('hex'),
    userId: user.id,
    createdAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  writeDb(db);
  return { user, session };
}

app.get('/api/auth/oauth/:provider', (req, res) => {
  const { provider } = req.params;
  if (provider !== 'google' && provider !== 'github') {
    return res.status(400).json({ error: 'Provider OAuth tidak didukung.' });
  }

  const redirectUri = `http://localhost:${PORT}/api/auth/callback/${provider}`;

  if (provider === 'google' && process.env.GOOGLE_CLIENT_ID) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  }

  if (provider === 'github' && process.env.GITHUB_CLIENT_ID) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  // Local OAuth callback flow when external client credentials are not configured
  return res.redirect(`/api/auth/callback/${provider}?code=local_oauth_${provider}`);
});

app.get('/api/auth/callback/:provider', async (req, res) => {
  const { provider } = req.params;
  const { code } = req.query;

  if ((provider !== 'google' && provider !== 'github') || !code) {
    return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);
  }

  try {
    let profile = null;

    if (
      provider === 'google' &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      !String(code).startsWith('local_oauth_')
    ) {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: String(code),
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `http://localhost:${PORT}/api/auth/callback/google`,
          grant_type: 'authorization_code',
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const gUser = await userRes.json();
        profile = {
          name: gUser.name || 'Google User',
          email: gUser.email,
          avatar: gUser.picture,
        };
      }
    } else if (
      provider === 'github' &&
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET &&
      !String(code).startsWith('local_oauth_')
    ) {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: String(code),
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'jevallene-ecosystem',
          },
        });
        const ghUser = await userRes.json();
        profile = {
          name: ghUser.name || ghUser.login || 'GitHub User',
          email: ghUser.email || `${ghUser.login}@users.noreply.github.com`,
          avatar: ghUser.avatar_url,
        };
      }
    }

    if (!profile) {
      profile =
        provider === 'google'
          ? {
              name: 'Jevallene Google Account',
              email: 'google.user@jevallene.local',
              avatar: '/jevallene-logo.svg',
            }
          : {
              name: 'Jevallene GitHub Account',
              email: 'github.user@jevallene.local',
              avatar: '/jevallene-logo.svg',
            };
    }

    const { session } = createOAuthSession(provider, profile);
    res.setHeader(
      'Set-Cookie',
      `jevallene_sid=${encodeURIComponent(session.sid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    );
    return res.redirect(`${CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error('[OAuth Callback Error]', err);
    return res.redirect(`${CLIENT_URL}/login?error=oauth_error`);
  }
});

app.get('/api/auth/me', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies.jevallene_sid;
  if (!sid) {
    return res.json({ authenticated: false, user: null });
  }
  const db = readDb();
  const session = db.sessions.find((s) => s.sid === sid);
  if (!session) {
    return res.json({ authenticated: false, user: null });
  }
  const user = db.users.find((u) => u.id === session.userId) || null;
  if (!user) {
    return res.json({ authenticated: false, user: null });
  }
  return res.json({ authenticated: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies.jevallene_sid;
  if (sid) {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.sid !== sid);
    writeDb(db);
  }
  res.setHeader(
    'Set-Cookie',
    'jevallene_sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  );
  return res.json({ ok: true });
});

app.get('/api/health', (_req, res) => {
  const db = readDb();
  res.json({
    status: 'OPERATIONAL',
    node: 'BDG-ID // PROD',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    productsCount: db.products.length,
    upcomingCount: db.upcomingModules.length,
    inquiriesCount: db.inquiries.length,
  });
});

app.get('/api/products', (req, res) => {
  const db = readDb();
  const { category = 'all', q = '', sort = 'populer', attrs = '' } = req.query;

  let items = [...db.products];

  if (category && category !== 'all') {
    items = items.filter((p) => p.category === category);
  }

  const attrList = String(attrs)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (attrList.length > 0) {
    items = items.filter((p) => attrList.every((a) => p.attributes.includes(a)));
  }

  const query = String(q).trim().toLowerCase();
  if (query) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.searchKeywords.toLowerCase().includes(query) ||
        p.techStackLabel.toLowerCase().includes(query),
    );
  }

  if (sort === 'terbaru') {
    items.sort((a, b) => b.releaseOrder - a.releaseOrder);
  } else if (sort === 'status') {
    items.sort((a, b) => a.number.localeCompare(b.number));
  } else {
    items.sort((a, b) => b.popularity - a.popularity);
  }

  res.json({
    products: items,
    upcomingModules: db.upcomingModules,
    total: items.length,
  });
});

app.get('/api/products/:slug', (req, res) => {
  const db = readDb();
  const product = db.products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  const related = db.products.filter((p) => p.slug !== product.slug);
  return res.json({ product, related });
});

app.post('/api/products/:slug/launch', (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p) => p.slug === req.params.slug);
  if (idx === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  db.products[idx].launches = (db.products[idx].launches || 0) + 1;
  writeDb(db);
  return res.json({
    slug: db.products[idx].slug,
    launches: db.products[idx].launches,
  });
});

app.get('/api/inquiries', (_req, res) => {
  const db = readDb();
  res.json({ inquiries: db.inquiries, total: db.inquiries.length });
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, projectType, message } = req.body ?? {};
  const trimmedName = String(name ?? '').trim();
  const trimmedEmail = String(email ?? '').trim();
  const trimmedType = String(projectType ?? 'Web Application').trim();
  const trimmedMessage = String(message ?? '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({
      error: 'Nama, email, dan deskripsi proyek wajib diisi.',
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({
      error: 'Format email tidak valid.',
    });
  }

  const db = readDb();
  const inquiry = {
    id: crypto.randomUUID(),
    name: trimmedName,
    email: trimmedEmail,
    projectType: trimmedType,
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(inquiry);
  writeDb(db);

  return res.status(201).json({
    message: 'Permintaan kolaborasi berhasil dicatat oleh Jevallene Backend.',
    inquiry,
  });
});

app.use((err, _req, res, _next) => {
  console.error('[API Error]', err);
  res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[JEVALLENE API] Backend running at http://localhost:${PORT}`);
  });
}

export default app;
