'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import type { SearchItem } from '@/lib/search-index';

interface SearchDialogProps {
  searchIndex: SearchItem[];
}

export default function SearchDialog({ searchIndex }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useRef<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    fuse.current = new Fuse(searchIndex, {
      threshold: 0.3,
      keys: ['title', 'excerpt', 'category', 'tags'],
    });
  }, [searchIndex]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    if (fuse.current) {
      setResults(fuse.current.search(query, { limit: 8 }).map((r) => r.item));
    }
  }, [query]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setResults([]);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      handleClose();
      router.push(`/blog/${slug}`);
    },
    [router, handleClose]
  );

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, handleOpen, handleClose]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-xl border border-[#c4d6ea] bg-[linear-gradient(180deg,#f7fbff_0%,#e6eff8_100%)] px-4 py-2 text-sm text-slate-600 shadow-sm transition-colors hover:border-brand-primary hover:text-brand-primary"
        aria-label="Search articles"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded bg-white px-1.5 py-0.5 text-xs text-slate-500 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={handleClose}
        >
          <div className="fixed inset-0 bg-[rgba(15,23,42,0.28)] backdrop-blur-sm" />
          <div
            className="relative mx-4 w-full max-w-lg overflow-hidden rounded-[1.4rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f7fbff_0%,#e9f1fa_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#d5e2ef] px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-400">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)]">
              {query.length >= 2 && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No articles found for &ldquo;{query}&rdquo;
                </p>
              )}
              {results.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  className="w-full border-b border-[#d9e5f1] px-4 py-3 text-left transition-colors hover:bg-[rgba(221,234,246,0.55)] last:border-b-0"
                >
                  <p className="line-clamp-1 text-sm font-medium text-slate-950">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.category !== 'Uncategorized' && (
                      <span className="rounded-full border border-[#d0deed] bg-white px-2 py-0.5 text-xs text-slate-600">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {item.readingTime} min read
                    </span>
                  </div>
                </button>
              ))}
              {query.length < 2 && (
                <p className="px-4 py-8 text-center text-sm text-slate-400">
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
