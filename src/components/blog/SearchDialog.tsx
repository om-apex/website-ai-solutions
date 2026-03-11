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
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 border rounded-lg hover:border-brand-primary hover:text-brand-primary transition-colors"
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
        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={handleClose}
        >
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
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
                className="flex-1 outline-none text-sm"
              />
              <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {query.length >= 2 && results.length === 0 && (
                <p className="px-4 py-8 text-sm text-gray-500 text-center">
                  No articles found for &ldquo;{query}&rdquo;
                </p>
              )}
              {results.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.category !== 'Uncategorized' && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {item.readingTime} min read
                    </span>
                  </div>
                </button>
              ))}
              {query.length < 2 && (
                <p className="px-4 py-8 text-sm text-gray-400 text-center">
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
