import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card'; 
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchWatches } from '../redux/slices/watchSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const { watches: featuredWatches } = useSelector((s) => s.watches);

  useEffect(() => {
    dispatch(fetchWatches({ featured: true, limit: 4 }));
  }, []);

  return (
    <div className="bg-[#0a0a09] text-[#E7E7D9] overflow-x-hidden selection:bg-[#958E62] selection:text-black">
      
      {/* 1. HERO SECTION - Adjusted height for Dock compatibility */}
      <section className="relative h-screen md:h-[calc(100vh-6rem)] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://buyfranklord.com/cdn/shop/files/franklord-mechanis-eclipse-noir-lume-shot.jpg?v=1752510137&width=1000"
            alt="Luxury Watch Background" 
            className="w-full h-full object-cover opacity-60 scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0a09]/80 via-transparent to-[#0a0a09]"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-5xl">
          <p className="font-['JetBrains_Mono'] text-[#958E62] text-[10px] md:text-xs uppercase tracking-[0.5em] md:tracking-[0.8em] animate-fade-in-up">
            Est. 2026 — The Pinnacle of Horology
          </p>
          <h1 className="font-['Baskervville'] italic text-5xl sm:text-7xl md:text-9xl leading-tight animate-fade-in-up-delayed">
            Obsidian
          </h1>
          <p className="font-['Playfair_Display'] italic text-base md:text-xl text-[#C2B994] max-w-xl mx-auto opacity-70 animate-fade-in-up-long px-4">
            Time is not merely measured; it is worn. Experience the fusion of master engineering and timeless elegance.
          </p>
          <div className="pt-6 animate-fade-in-up-long">
            <Link to="/collections" className="clay-button inline-block px-8 md:px-12 py-4 md:py-5 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold transition-all duration-500 rounded-full">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BRAND TICKER with Mask Effect */}
      <div className="py-10 md:py-16 border-y border-white/5 bg-[#0d0d0c]/50 backdrop-blur-sm relative z-20 overflow-hidden ticker-mask">
        <div className="flex whitespace-nowrap">
          <div className="flex items-center space-x-12 md:space-x-24 animate-loop-scroll px-6 md:px-12">
            {['ROLEX', 'PATEK PHILIPPE', 'RADO', 'AUDEMARS PIGUET', 'VACHERON CONSTANTIN', 'OMEGA'].map((brand, i) => (
              <span key={`${brand}-${i}`} className="text-[#2b2a22] text-3xl md:text-5xl font-['Baskervville'] italic hover:text-[#958E62] transition-colors cursor-default whitespace-nowrap">
                {brand}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-12 md:space-x-24 animate-loop-scroll px-6 md:px-12" aria-hidden="true">
            {['ROLEX', 'PATEK PHILIPPE', 'RADO', 'AUDEMARS PIGUET', 'VACHERON CONSTANTIN', 'OMEGA'].map((brand, i) => (
              <span key={`${brand}-dup-${i}`} className="text-[#2b2a22] text-3xl md:text-5xl font-['Baskervville'] italic hover:text-[#958E62] transition-colors cursor-default whitespace-nowrap">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PHILOSOPHY SECTION */}
      <section className="py-20 md:py-40 px-6 md:px-20 grid lg:grid-cols-2 gap-16 md:gap-32 items-center max-w-screen-2xl mx-auto">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-5/5 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/5">
             <img 
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000" 
              alt="Watch Craftsmanship" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-[#958E62]/30 rounded-br-[3rem] hidden md:block pointer-events-none"></div>
        </div>

        <div className="space-y-8 md:space-y-12 order-1 lg:order-2">
          <div className="space-y-4 text-center lg:text-left">
            <h4 className="text-[#958E62] font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.5em]">The Philosophy</h4>
            <h2 className="font-['Baskervville'] italic text-4xl md:text-7xl text-[#DED5A4] leading-[1.1]">
              Engineering <br/> Meets Elegance
            </h2>
          </div>
          <p className="font-['Playfair_Display'] text-lg md:text-xl text-[#C2B994]/80 leading-relaxed font-light text-center lg:text-left">
            Obsidian is a sanctuary for the world’s most significant horological achievements. We bridge the gap between historical heritage and modern precision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 border-t border-white/5 pt-10">
            <div className="space-y-2">
              <h4 className="text-[#DED5A4] font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-px bg-[#958E62]"></span> Heritage
              </h4>
              <p className="text-[#C2B994]/50 text-xs md:text-sm italic font-['Playfair_Display']">
                From the timeless complications of Patek Philippe to the avant-garde materials of Rado.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[#DED5A4] font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-px bg-[#958E62]"></span> Authentication
              </h4>
              <p className="text-[#C2B994]/50 text-xs md:text-sm italic font-['Playfair_Display']">
                Every movement is inspected by our horologists to guarantee the Obsidian Standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED VAULT SECTION */}
      <section className="py-20 md:py-32 bg-[#0d0d0c] relative">
        <div className="text-center mb-16 md:mb-24 px-4">
          <h4 className="text-[#958E62] font-['JetBrains_Mono'] text-[10px] md:text-xs uppercase tracking-[0.8em] mb-4">The Selection</h4>
          <h2 className="font-['Baskervville'] italic text-4xl md:text-7xl text-[#DED5A4]">Curated Vault</h2>
          <div className="w-16 h-px bg-[#958E62]/40 mx-auto mt-8"></div>
        </div>
        
        <div className="flex flex-col gap-12">
           {featuredWatches.map((watch, index) => (
             <Card key={index} index={index} {...watch} />
           ))}
        </div>

        <div className="mt-20 md:mt-32 text-center">
           <Link to="/collections" className="group flex flex-col items-center gap-6">
             <span className="text-[#958E62] font-['JetBrains_Mono'] text-[10px] md:text-xs uppercase tracking-[0.4em] group-hover:text-white transition-colors duration-500">
               View Full Archive
             </span>
             <div className="w-px h-20 bg-linear-to-b from-[#958E62] to-transparent animate-pulse"></div>
           </Link>
        </div>
      </section>

      {/* 5. FOOTER - Safety space for Luxury Dock */}
      <footer className="pt-20 pb-40 md:pb-20 px-8 border-t border-white/5 bg-[#0a0a09]">
         <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <img src="/src/assets/logo.png" alt="Obsidian" className="h-6 md:h-8 opacity-40 hover:opacity-100 transition-opacity" />
           <p className="font-['JetBrains_Mono'] text-[9px] md:text-[10px] text-[#817b49] tracking-[0.4em] uppercase text-center">
             Obsidian Private Limited © 2026 — Secure & Verified
           </p>
           <div className="flex gap-8 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#958E62]/60">
              <a href="#" className="hover:text-white transition-colors">Legal</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
           </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;