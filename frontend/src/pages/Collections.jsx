import React, { useEffect } from 'react';
import Card from '../components/Card.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatches } from '../redux/slices/watchSlice.js';

const Collections = () => {
  const dispatch=useDispatch();
  const {watches, loading,error,pagination,filters } =useSelector((state)=> (state.watches));
    useEffect(() => {
      dispatch(fetchWatches(filters));
    }, [filters]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#958E62] font-['JetBrains_Mono'] text-xs tracking-widest">Loading...</div>;

if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-400 font-['JetBrains_Mono'] text-xs tracking-widest">{error}</div>;
  return (
    
    <main className="w-full min-h-screen bg-black">

      
      {/* Page Header/Title: 
          Adds high-end editorial feel before the scroll 
      */}
      <div className="pt-28 md:pt-40 pb-10 px-10 text-center">
        <h1 className="font-['Baskervville'] italic text-3xl md:text-5xl text-[#C2B994] opacity-80 uppercase tracking-[0.3em]">
          The Private Collection
        </h1>
        <div className="w-20 h-px bg-[#C2B994]/40 mx-auto mt-6"></div>
      </div>

      <div className="flex flex-col space-y-12 md:space-y-24 pb-32 md:pb-20">
        {watches.map((watch, index) => (
          <Card key={watch._id} index={index} {...watch} />
        ))}
      </div>

{/* pagination */}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 py-16">

          {/* prev button */}
          <button
            disabled={pagination.page === 1}
            onClick={() => dispatch(fetchWatches({ ...filters, page: pagination.page - 1 }))}
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62] disabled:opacity-20 hover:text-white transition-colors px-4 py-2 border border-[#958E62]/20 rounded-full hover:border-[#958E62]/60 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {/* page numbers */}
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => dispatch(fetchWatches({ ...filters, page: pageNum }))}
              className={`font-['JetBrains_Mono'] text-[9px] w-8 h-8 rounded-full border transition-all
                ${pagination.page === pageNum
                  ? 'bg-[#958E62] text-[#0a0a09] border-[#958E62]'
                  : 'text-[#958E62] border-[#958E62]/20 hover:border-[#958E62]/60 hover:text-white'
                }`}
            >
              {pageNum}
            </button>
          ))}

          {/* next button */}
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => dispatch(fetchWatches({ ...filters, page: pagination.page + 1 }))}
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-[#958E62] disabled:opacity-20 hover:text-white transition-colors px-4 py-2 border border-[#958E62]/20 rounded-full hover:border-[#958E62]/60 disabled:cursor-not-allowed"
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