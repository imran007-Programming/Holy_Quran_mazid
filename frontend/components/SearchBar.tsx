"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        onClose?.();
      }
    },
    [query, router, onClose]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-gray-400 pointer-events-none"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ayahs in Arabic or English..."
          className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-[#4CAF50] text-white rounded-xl text-sm font-medium hover:bg-[#43a047] transition-colors"
      >
        Search
      </button>
    </form>
  );
}
