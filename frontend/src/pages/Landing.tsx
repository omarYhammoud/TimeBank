import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { Link } from 'react-router-dom';
import ReviewList from '../components/common/ReviewList';

// Modern Swiper bundle styles
import 'swiper/swiper-bundle.css';

export default function Landing() {
  const communityMembers = [
    {
      name: "Alex Rivera",
      role: "Full-Stack Developer",
      offer: "React & Node.js Code Reviews",
      cost: "1 Hour / Session",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
      color: "from-indigo-500 to-blue-600"
    },
    {
      name: "Sarah Chen",
      role: "Language Instructor",
      offer: "Conversational Mandarin Lessons",
      cost: "1 Hour / Hr",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Marcus Vance",
      role: "Network Engineer",
      offer: "Home Router & Network Setup",
      cost: "1 Hour / Job",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      color: "from-emerald-500 to-teal-600"
    },
    {
      name: "Elena Rostova",
      role: "Musician",
      offer: "Beginner Guitar & Music Theory",
      cost: "1 Hour / Hr",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white flex flex-col w-full">
      
      {/* Background flare wrapper - completely bounded */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-full h-[400px] pointer-events-none opacity-25 blur-[120px] bg-gradient-to-b from-indigo-600 to-transparent rounded-full z-0" />

      {/* 1. NAVIGATION BAR */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-base sm:text-lg text-white shadow-lg">
            ⏳
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
            TimeBank
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/signin" className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. HERO MAIN PANEL */}
      <header className="relative z-10 w-full max-w-5xl mx-auto pt-8 sm:pt-16 pb-8 px-4 sm:px-6 text-center flex flex-col items-center min-w-0">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-[10px] sm:text-xs font-semibold tracking-wide mb-6 sm:mb-8 shadow-inner max-w-full truncate">
           Join 1,200+ Neighbors Exchanging Skills
        </div>

        {/* Responsive Heading */}
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto px-1">
          Exchange Services Using <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Time As Currency
          </span>
        </h1>

        {/* Paragraph */}
        <p className="text-xs sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Welcome to the marketplace where money has no value. Help someone with your skills, earn hourly credits, and spend them on anything you need.
        </p>

        {/* Call to Action Row */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-16 sm:mb-24 w-full max-w-xs sm:max-w-none">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto text-center text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:opacity-95 transition-all w-full"
          >
            Create Free Account
          </Link>
          <Link 
            to="/signin" 
            className="w-full sm:w-auto text-center text-sm sm:text-base font-bold bg-slate-900/60 text-slate-300 border border-slate-800/80 px-8 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all w-full"
          >
            Browse Marketplace
          </Link>
        </div>

        {/* 🛠️ SLIDER WRAPPER FIX: Fixed width and layout limits added to container */}
        <div className="w-full max-w-full overflow-hidden px-1 sm:px-4 min-w-0">
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            coverflowEffect={{
              rotate: 10,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-12"
          >
            {communityMembers.map((member, index) => (
              <SwiperSlide key={index} className="bg-slate-900/90 border border-slate-800/80 text-left rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm flex flex-col justify-between min-h-[360px] h-auto">
                <div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-800">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-slate-800">
                      ⭐ {member.rating}
                    </div>
                  </div>

                  <div className="mb-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">{member.name}</h3>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium line-clamp-2 italic">
                    "{member.offer}"
                  </p>
                </div>

                <div className={`mt-4 w-full bg-gradient-to-r ${member.color} px-3 py-2 rounded-xl flex justify-between items-center shadow-inner`}>
                  <span className="text-[10px] font-semibold text-white/95">Value:</span>
                  <span className="text-[11px] font-black text-white bg-slate-950/20 px-2 py-0.5 rounded">{member.cost}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </header>

      {/* 3. HOW IT WORKS */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 mb-16 bg-slate-900/30 backdrop-blur-md border border-slate-900/60 rounded-2xl sm:rounded-3xl shadow-2xl min-w-0 overflow-hidden">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2.5">
            How TimeBank Operates
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-2">
            A frictionless value exchange system built for communities. Earn hours by sharing your skills, then redeem them to learn from others.
          </p>
        </div>

        <div className="max-w-3xl mx-auto min-w-0">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 9000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-8"
          >
            <SwiperSlide>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left p-2 sm:p-4">
                <div className="text-3xl sm:text-4xl p-3 sm:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">🤝</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">1. Post Your Offerings</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    List fields you specialize in—like technical language training, specialized network server configurations, guitar performance, or web application logic.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left p-2 sm:p-4">
                <div className="text-3xl sm:text-4xl p-3 sm:p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">💳</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">2. Gain Direct Time Tokens</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Earn precisely one time credit token for every full hour of assistance you successfully execute. All balances post seamlessly to your secure ledger dashboard.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left p-2 sm:p-4">
                <div className="text-3xl sm:text-4xl p-3 sm:p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400 shrink-0">🛍️</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">3. Cashless Redemptions</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Redeem your saved hour credits across the community platform to secure the custom help or specialized instruction you need fee-free.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>


            <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
  <h2 className="text-2xl sm:text-3xl font-black text-white mb-8">Latest Community Activity</h2>
  <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
    <ReviewList isLatest={true} />
  </div>
</section>
      {/* 4. METRICS STRIP GRID */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-900/80">
            <div className="text-xl p-2.5 bg-slate-900 rounded-lg h-fit">🛡️</div>
            <div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm mb-1 tracking-wide">Transparent Token Ledgers</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">Track every deposit instantly inside your private wallet dashboard logs.</p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-900/80">
            <div className="text-xl p-2.5 bg-slate-900 rounded-lg h-fit">⭐</div>
            <div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm mb-1 tracking-wide">Mutual Accountability</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">Bidirectional loop loops require both members to approve exchange tracking details.</p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-900/80">
            <div className="text-xl p-2.5 bg-slate-900 rounded-lg h-fit">⚡</div>
            <div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm mb-1 tracking-wide">Dispute Protection</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">Dedicated admin moderation layers provide quick scale mediation support.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-900/60 text-center text-[11px] text-slate-600 mt-auto">
        &copy; {new Date().getFullYear()} TimeBank Exchange. All Rights Reserved.
      </footer>
    </div>
  );
}
