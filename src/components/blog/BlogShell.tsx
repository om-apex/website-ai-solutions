import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BlogShellProps {
  badge: string;
  title: string;
  description: string;
  accent?: string;
  searchSlot?: ReactNode;
  backLink?: ReactNode;
  preContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function BlogShell({
  badge,
  title,
  description,
  accent,
  searchSlot,
  backLink,
  preContent,
  children,
  className,
}: BlogShellProps) {
  return (
    <main className="blog-site-shell min-h-[calc(100svh-80px)]">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className={cn('blog-shell-card rounded-[2rem] p-6 md:p-8', className)}>
            {backLink && <div className="mb-5">{backLink}</div>}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="blog-shell-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
                  {badge}
                </div>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                  {description}
                </p>
                {accent && (
                  <div className="mt-5 text-sm font-medium text-brand-primary">
                    {accent}
                  </div>
                )}
              </div>

              {searchSlot && (
                <div className="flex shrink-0 justify-start lg:justify-end">
                  {searchSlot}
                </div>
              )}
            </div>
          </div>

          {preContent && <div className="mt-6">{preContent}</div>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
