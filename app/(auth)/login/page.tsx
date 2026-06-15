"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  // 4. Step 2: Verify the code
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email',
    });

    // FIX: Helper function to securely inject the Full Name into the database 
    // immediately after the user session is authenticated.
    const updateProfile = async (userId: string) => {
      if (fullName) {
        await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', userId);
      }
    };

    if (error) {
      // The Fallback block
      if (error.message.includes('Token has expired') || error.message.includes('validation')) {
         const retry = await supabase.auth.verifyOtp({
            email: email,
            token: otp,
            type: 'signup', 
         });
         
         if (retry.error) {
            setError(retry.error.message);
            setLoading(false);
            return;
         } else if (retry.data.session && retry.data.user) {
            await updateProfile(retry.data.user.id); // Update profile on fallback success
            router.push('/dashboard');
            router.refresh();
            return;
         }
      }

      setError(error.message);
      setLoading(false);
    } else if (data.session && data.user) {
      await updateProfile(data.user.id); // Update profile on primary success
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-[420px] bg-lifted rounded-[40px] border-[1.5px] border-ink p-10 shadow-[0_24px_48px_rgba(0,0,0,0.08)]">
        
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-2">
          <span className="text-signal text-lg leading-none font-bold">•</span>
          <span className="font-bold tracking-[0.04em] uppercase text-sm text-ink font-sans">SYSTEM ACCESS</span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] leading-tight font-medium tracking-[-0.02em] text-ink mb-8">
          {step === 1 ? "Sign in to FeedLoop" : "Verify your identity"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-[#F3F0EE] border-[1.5px] border-[#CF4500] text-[#CF4500] text-sm font-medium rounded-[20px]">
            {error}
          </div>
        )}

       

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-6">

             {/* NEW: Full Name Block */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-[15px] font-medium text-ink">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-putty border-[1.5px] border-ink text-ink rounded-[20px] px-5 py-[14px] outline-none focus:ring-2 focus:ring-ink/20 transition-all placeholder:text-slate/60 text-[15px]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[15px] font-medium text-ink">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-putty border-[1.5px] border-ink text-ink rounded-[20px] px-5 py-[14px] outline-none focus:ring-2 focus:ring-ink/20 transition-all placeholder:text-slate/60 text-[15px]"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-putty rounded-[20px] py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Access Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
            <p className="text-slate text-[15px] leading-relaxed">
              We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>.
            </p>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="text-[15px] font-medium text-ink">
                6-Digit OTP
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-putty border-[1.5px] border-ink text-ink rounded-[20px] px-5 py-[14px] outline-none focus:ring-2 focus:ring-ink/20 transition-all text-center tracking-[0.5em] font-medium placeholder:tracking-normal placeholder:text-slate/60 text-lg"
                required
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-putty font-medium rounded-[20px] py-[14px] px-6 hover:opacity-90 transition-opacity flex justify-center items-center text-[15px] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Identity"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-white text-ink font-medium rounded-[20px] py-[14px] px-6 border-[1.5px] border-ink hover:bg-slate/5 transition-colors text-[15px]"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}