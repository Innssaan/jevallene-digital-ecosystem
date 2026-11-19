import React, { useState } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3030] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#FF3030] to-[#ae0f20] hover:from-[#D41414] hover:to-[#FF3030] text-[#f5f5f7] border border-[#FF3030] shadow-[0_0_28px_rgba(255,48,48,0.35)] hover:shadow-[0_0_40px_rgba(255,48,48,0.5)]',
    secondary:
      'bg-[#14141a]/55 backdrop-blur-md hover:bg-white/[0.05] text-[#fafafa] border border-white/[0.12] hover:border-[#FF3030]/40 shadow-[inset_0_1px_rgba(255,255,255,0.12),0_4px_14px_rgba(0,0,0,0.28)] hover:shadow-[inset_0_1px_rgba(255,255,255,0.16),0_6px_22px_rgba(255,48,48,0.28)]',
    outline:
      'bg-[#14141a]/40 backdrop-blur-md hover:bg-white/[0.05] text-[#fafafa] border border-white/[0.14] hover:border-[#FF3030]/50 shadow-[inset_0_1px_rgba(255,255,255,0.12),0_4px_14px_rgba(0,0,0,0.28)] hover:shadow-[0_0_24px_rgba(255,48,48,0.3)]',
    ghost:
      'bg-transparent hover:bg-white/[0.05] text-[#F5F5F5]/80 hover:text-white shadow-none hover:shadow-[0_0_18px_rgba(255,48,48,0.22)]',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm sm:text-base font-semibold',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function SurfaceCard({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl bg-[#171717]/80 border border-[#242424] hover:border-[#FF3030]/40 transition-all duration-300 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function InputField({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-[#F5F5F5]/80">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-[#090909] border text-sm text-white placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-[#FF3030] focus:border-[#FF3030] focus:ring-[#FF3030]'
            : 'border-[#242424] hover:border-white/20 focus:border-[#FF3030] focus:ring-[#FF3030]'
        } disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#FF3030]">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, options, id, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-[#F5F5F5]/80">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-[#090909] border border-[#242424] hover:border-white/20 focus:border-[#FF3030] focus:outline-none focus:ring-1 focus:ring-[#FF3030] text-sm text-white transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#090909] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={item.question}
            className="rounded-2xl bg-[#171717]/80 border border-[#242424] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <span className="font-medium text-sm sm:text-base text-white">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#FF3030] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm text-neutral-400 leading-relaxed border-t border-[#242424]/70 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-full bg-[#171717] border border-[#242424]">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#FF3030] text-white shadow-[0_0_14px_rgba(255,48,48,0.35)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#171717] border border-[#242424] shadow-2xl overflow-hidden animate-fade-up">
        <div className="px-6 py-4 border-b border-[#242424] flex items-center justify-between">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#171717] border border-[#242424] p-6 space-y-4 animate-pulse">
      <div className="h-40 rounded-xl bg-[#242424]" />
      <div className="h-5 w-2/3 rounded bg-[#242424]" />
      <div className="h-4 w-full rounded bg-[#242424]" />
      <div className="h-4 w-4/5 rounded bg-[#242424]" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#171717]/60 border border-[#242424] p-10 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-[#FF3030]/15 border border-[#FF3030]/30 mx-auto flex items-center justify-center text-[#FF3030] font-mono text-sm">
        ∅
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-md mx-auto">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[#850909]/20 border border-[#FF3030]/40 p-6 text-center space-y-3">
      <p className="text-sm text-[#F5F5F5]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
