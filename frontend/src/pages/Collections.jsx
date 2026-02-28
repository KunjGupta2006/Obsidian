import React, { useEffect } from 'react';
import Card from '../components/Card.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchWatches, setFilters, resetFilters } from '../redux/slices/watchSlice.js';

const Collections = () => {
  const dispatch                                          = useDispatch();
  const [searchParams, setSearchParams]                  = useSearchParams();
  const { watches, loading, error, pagination, filters } = useSelector((s) => s.watches);

  // single effect — runs whenever the URL search params change
  useEffect(() => {
    const searchFromURL = searchParams.get('search');

    if (searchFromURL) {
      // sync URL param into Redux filters AND fetch in one dispatch
      const newFilters = { ...filters, search: searchFromURL, page: 1 };
      dispatch(setFilters(newFilters));
      dispatch(fetchWatches(newFilters));
    } else {
      // no search param — fetch with whatever filters are in Redux
      dispatch(fetchWatches(filters));
    }
  }, [searchParams]); // re-runs whenever URL changes (navbar search, or clearing)

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    dispatch(setFilters(newFilters));
    dispatch(fetchWatches(newFilters));
  };

  const handleClearSearch = () => {
    dispatch(resetFilters());
    setSearchParams({});           // clear ?search= from URL
    dispatch(fetchWatches({}));
  };

  const activeSearch = searchParams.get('search') || filters.search;

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center
                    text-[#958E62] font-['JetBrains_Mono'] text-xs tracking-widest">
      Loading...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center
                    text-red-400 font-['JetBrains_Mono'] text-xs tracking-widest">
      {error}
    </div>
  );

  return (
    <main className="w-full min-h-screen bg-black">

      {/* header */}
      <div className="pt-28 md:pt-40 pb-10 px-10 text-center">
        <h1 className="font-['Baskervville'] italic text-3xl md:text-5xl text-[#C2B994] opacity-80 uppercase tracking-[0.3em]">
          The Private Collection
        </h1>
        <div className="w-20 h-px bg-[#C2B994]/40 mx-auto mt-6" />

        {/* active search indicator */}
        {activeSearch && (
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2
                          border border-[#958E62]/25 rounded-full">
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] text-white/40">
              Results for
            </span>
            <span className="font-['Playfair_Display'] italic text-sm text-[#958E62]">
              "{activeSearch}"
            </span>
            <button
              onClick={handleClearSearch}
              className="text-white/25 hover:text-[#958E62] transition-colors cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* result count */}
        {pagination?.total !== undefined && (
          <p className="mt-3 font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.4em] text-white/20">
            {pagination.total} {pagination.total === 1 ? 'timepiece' : 'timepieces'}
          </p>
        )}
      </div>

      {/* empty state */}
      {watches.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-white/20">
            No timepieces found
          </p>
          {activeSearch && (
            <button
              onClick={handleClearSearch}
              className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest
                         text-[#958E62] border-b border-[#958E62]/30 pb-0.5"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* watch grid */}
      <div className="flex flex-col space-y-12 md:space-y-24 pb-32 md:pb-20">
        {watches.map((watch, index) => (
          <Card key={watch._id} index={index} {...watch} />
        ))}
      </div>

      {/* pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 py-16">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62]
                       disabled:opacity-20 hover:text-white transition-colors px-4 py-2
                       border border-[#958E62]/20 rounded-full hover:border-[#958E62]/60
                       disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`font-['JetBrains_Mono'] text-[9px] w-8 h-8 rounded-full border transition-all
                ${pagination.page === pageNum
                  ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]'
                  : 'text-[#958E62] border-[#958E62]/20 hover:border-[#958E62]/60 hover:text-white'
                }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62]
                       disabled:opacity-20 hover:text-white transition-colors px-4 py-2
                       border border-[#958E62]/20 rounded-full hover:border-[#958E62]/60
                       disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <footer className="py-10 text-center opacity-20 font-['JetBrains_Mono'] text-xs tracking-widest text-white uppercase">
        © 2026 Curated Luxury — All Rights Reserved
      </footer>
    </main>
  );
};

export default Collections;