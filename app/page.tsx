import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 1. Check for an active Supabase session
  if (session) {
    redirect('/dashboard');
  }

  // 2. No forms or server actions here. Handled by <GlobalHeader /> in layout.tsx.

  return (
    <main className="bg-[#FCFBFA] text-[#141413] selection:bg-[#CF4500]/20 selection:text-[#141413]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] pt-32 flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Subtle blurred background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-[0.04] blur-[120px] bg-gradient-to-br from-[#CF4500] to-[#141413] rounded-full z-0" />
        
        <div className="z-10 flex flex-col items-center max-w-4xl w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CF4500]"></span>
            <span className="text-sm font-bold tracking-[0.04em] uppercase text-[#141413]">FeedLoop</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-medium tracking-[-0.02em] leading-[1.05] mb-8">
            Capture Feedback.<br /> Without the Noise.
          </h1>
          
          <p className="text-xl md:text-2xl font-[450] text-[#141413]/70 mb-14 max-w-2xl leading-relaxed">
            The privacy-focused, lightweight widget for web developers to effortlessly collect and categorize user insights.
          </p>

          <a 
            href="#features"
            className="px-10 py-5 font-medium bg-[#141413] text-[#FCFBFA] rounded-[20px] border-[1.5px] border-[#141413] transition-transform hover:scale-[1.02] active:scale-95 whitespace-nowrap inline-flex items-center justify-center text-lg shadow-[0px_8px_16px_rgba(0,0,0,0.1)]"
          >
            Explore the loop
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 scroll-mt-24 relative z-10 bg-[#FCFBFA]">
        <div className="max-w-5xl mx-auto space-y-32">
          
          {/* Feature 1: DOM Screen Capture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="flex flex-col items-start">
              <span className="font-mono text-sm uppercase tracking-widest text-[#141413]/60 mb-6 font-bold">01 // Visual Context</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.02em] mb-6">DOM Screen Capture</h2>
              <p className="text-lg md:text-xl font-[450] text-[#141413]/80 leading-relaxed mb-6">
                Our lightweight widget automatically generates pixel-perfect screenshots of the user's viewport using html2canvas. Sensitive fields are masked client-side before any pixels leave the browser.
              </p>
            </div>
            <div className="h-72 md:h-[28rem] w-full rounded-[40px] border-[1.5px] border-[#141413] bg-[#F3F0EE] flex items-center justify-center overflow-hidden relative shadow-[0px_24px_48px_rgba(0,0,0,0.04)] group">
               <div className="font-mono text-sm opacity-40 absolute bottom-8 left-8 transition-opacity group-hover:opacity-100">&gt; html2canvas(document.body)</div>
               {/* Abstract decorative graphic */}
               <div className="absolute top-12 left-12 w-[60%] h-6 border-[1.5px] border-[#141413] bg-white rounded-full"></div>
               <div className="absolute top-24 left-12 w-[80%] h-40 border-[1.5px] border-[#141413] bg-white rounded-[20px]"></div>
               <div className="absolute top-24 left-12 w-[80%] h-40 border-[1.5px] border-[#141413] bg-[#141413] rounded-[20px] mix-blend-overlay opacity-5 transform translate-x-3 translate-y-3"></div>
               <div className="absolute top-[50%] right-12 w-12 h-12 border-[1.5px] border-[#141413] bg-white rounded-full flex items-center justify-center text-[#141413] shadow-sm transform -translate-y-1/2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
               </div>
            </div>
          </div>

          {/* Feature 2: Emotional Sentiment Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="h-72 md:h-[28rem] w-full rounded-[40px] border-[1.5px] border-[#141413] bg-[#F3F0EE] flex items-center justify-center overflow-hidden relative shadow-[0px_24px_48px_rgba(0,0,0,0.04)] order-last md:order-first group">
               <div className="font-mono text-sm opacity-40 absolute bottom-8 left-8 transition-opacity group-hover:opacity-100">&gt; SELECT emotion FROM feedback</div>
               <div className="flex gap-4 md:gap-6 z-10">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] border-[#141413] flex items-center justify-center text-3xl bg-white shadow-sm hover:-translate-y-2 transition-transform cursor-pointer">😍</div>
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] border-[#141413] flex items-center justify-center text-3xl bg-white shadow-sm hover:-translate-y-2 transition-transform cursor-pointer -translate-y-4">🤔</div>
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] border-[#141413] flex items-center justify-center text-3xl bg-white shadow-sm hover:-translate-y-2 transition-transform cursor-pointer">🐛</div>
               </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-mono text-sm uppercase tracking-widest text-[#141413]/60 mb-6 font-bold">02 // User Empathy</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.02em] mb-6">Emotional Sentiment</h2>
              <p className="text-lg md:text-xl font-[450] text-[#141413]/80 leading-relaxed mb-6">
                Go beyond raw text. Capture the exact emotional state of your users at the moment they submit feedback. Instantly filter triage lists by frustration or delight.
              </p>
            </div>
          </div>

          {/* Feature 3: Browser Metadata Harvesting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="flex flex-col items-start">
              <span className="font-mono text-sm uppercase tracking-widest text-[#141413]/60 mb-6 font-bold">03 // Technical Precision</span>
              <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.02em] mb-6">Metadata Harvesting</h2>
              <p className="text-lg md:text-xl font-[450] text-[#141413]/80 leading-relaxed mb-6">
                Stop asking users for their OS and browser version. We silently harvest viewport dimensions, user-agent strings, and device capabilities attached to every submission.
              </p>
            </div>
            <div className="h-72 md:h-[28rem] w-full rounded-[40px] border-[1.5px] border-[#141413] bg-[#141413] text-[#FCFBFA] flex flex-col p-8 md:p-12 overflow-hidden relative shadow-[0px_24px_48px_rgba(0,0,0,0.12)]">
               <div className="w-full flex gap-2 mb-8 opacity-50">
                 <div className="w-3 h-3 rounded-full border-[1px] border-[#FCFBFA]"></div>
                 <div className="w-3 h-3 rounded-full border-[1px] border-[#FCFBFA]"></div>
                 <div className="w-3 h-3 rounded-full border-[1px] border-[#FCFBFA]"></div>
               </div>
               <div className="font-mono text-sm md:text-base space-y-4">
                 <div className="flex items-start flex-col gap-1">
                    <span className="text-[#CF4500] font-bold">&gt; navigator.userAgent</span>
                    <span className="text-[#FCFBFA]/70">"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36..."</span>
                 </div>
                 <div className="flex items-start flex-col gap-1 mt-4">
                    <span className="text-[#CF4500] font-bold">&gt; window.innerWidth</span>
                    <span className="text-[#FCFBFA]/70">1920</span>
                 </div>
                 <div className="flex items-start flex-col gap-1 mt-4">
                    <span className="text-[#CF4500] font-bold">&gt; navigator.language</span>
                    <span className="text-[#FCFBFA]/70">"en-US"</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Editorial Footer */}
      <section className="pt-32 pb-12 px-4 bg-[#FCFBFA]">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-medium tracking-[-0.02em] mb-8">
            Ready to close the loop?
          </h2>
          <p className="text-xl md:text-2xl font-[450] text-[#141413]/70 max-w-2xl leading-relaxed">
            Integrate the widget with a single line of code. <br /> Sign in via the top navigation to begin.
          </p>
        </div>
        
        <footer className="max-w-5xl mx-auto border-t-[1.5px] border-[#141413] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#141413]"></span>
            <span className="text-sm font-bold tracking-[0.04em] uppercase">FeedLoop Inc.</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-[#141413]">
            <a href="#" className="hover:underline underline-offset-4 decoration-[1.5px] transition-all">Documentation</a>
            <a href="#" className="hover:underline underline-offset-4 decoration-[1.5px] transition-all">Privacy Policy</a>
            <a href="#" className="hover:underline underline-offset-4 decoration-[1.5px] transition-all">Terms of Service</a>
          </div>
        </footer>
      </section>
    </main>
  );
}
