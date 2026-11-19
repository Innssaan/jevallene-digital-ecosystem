import { useState } from 'react';

export function LiveProductPreview({
  url,
  title,
  fallbackImage,
  badge,
  className = 'aspect-[16/10]',
}: {
  url: string;
  title: string;
  fallbackImage: string;
  badge?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${className} bg-[#090909] overflow-hidden relative border-b border-[#242424]`}>
      {/* Fallback image while live preview loads */}
      <img
        src={fallbackImage}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-70'
        }`}
      />

      {/* Scaled Live Website Preview */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={url}
          title={`${title} Live Preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          tabIndex={-1}
          className="w-[333.34%] h-[333.34%] origin-top-left scale-[0.3] border-0 pointer-events-none bg-[#090909]"
        />
      </div>

      {/* Subtle top-bottom vignette so badges stay legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090909]/60 via-transparent to-[#090909]/30"
      />

      {badge && (
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#090909]/85 backdrop-blur-md border border-[#242424] text-[11px] font-mono text-[#F5F5F5]">
          {badge}
        </span>
      )}

      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090909]/85 backdrop-blur-md border border-[#FF3030]/40 text-[10px] font-mono text-white">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            loaded ? 'bg-[#4ae176]' : 'bg-[#FF3030] animate-pulse'
          }`}
        />
        <span>{loaded ? 'LIVE' : 'LOADING'}</span>
      </span>
    </div>
  );
}
