import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SpotlightItem {
  label: string;
  title: string;
  description: string;
  href?: string;
}

interface SeriesSpotlightProps {
  eyebrow: string;
  title: string;
  description: string;
  items: SpotlightItem[];
}

export default function SeriesSpotlight({
  eyebrow,
  title,
  description,
  items,
}: SeriesSpotlightProps) {
  return (
    <section className="blog-shell-card rounded-[1.75rem] p-5 md:p-6">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 md:text-[2rem]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const content = (
            <div className="flex h-full flex-col rounded-[1.35rem] border border-[rgba(148,163,184,0.18)] bg-white/78 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
              <span className="inline-flex w-fit rounded-full border border-[rgba(148,163,184,0.18)] bg-white/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
                {item.label}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
              {item.href && (
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-primary">
                  Explore
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );

          if (!item.href) {
            return <div key={item.title}>{content}</div>;
          }

          return (
            <Link key={item.title} href={item.href} className="group block">
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
