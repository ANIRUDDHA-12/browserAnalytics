import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export async function GlobalHeader() {
  const supabase = await createClient()

  const {data:{user}} = await supabase.auth.getUser()
   
    // setting up dynamic variables
    let profileName = "User";
  let initial = "U";

    if(user){
      const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

      if (profile?.name) {
      profileName = profile.name;
      initial = profile.name.charAt(0).toUpperCase();
    } else if (user.email) {
      initial = user.email.charAt(0).toUpperCase();
    }
    }

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl bg-white rounded-full px-10 py-4 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between">
      {/* Logomark -  Inspired */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {/* <div className="w-8 h-8 rounded-full bg-signal mix-blend-multiply opacity-90"></div> */}
          {/* <div className="w-8 h-8 rounded-full bg-slate mix-blend-multiply opacity-80"></div> */}
        </div>
        <Link href="/" className="font-sans font-bold tracking-[-0.02em] text-ink text-xl uppercase">
          FeedLoop
        </Link>
      </div>

      {/* Centered Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/dashboard" className="text-ink font-medium tracking-[-0.02em] hover:text-signal transition-colors">
          Dashboard
        </Link>
        {/* <Link href="/projects" className="text-ink font-medium tracking-[-0.02em] hover:text-signal transition-colors">
          Projects
        </Link> */}
        <Link href="/dashboard/settings" className="text-ink font-medium tracking-[-0.02em] hover:text-signal transition-colors">
          Settings
        </Link>
      </nav>

      {/* User Profile Chip */}
      <div className="flex items-center">
        {user ? (
          // Logged In: Show their personalized pill linking to settings
          <Link href="/dashboard/settings" className="flex items-center gap-2 bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-full pl-4 pr-1 py-1 hover:bg-[#F3F0EE] transition-colors">
            <span className="text-sm font-medium tracking-[-0.02em] text-[#141413] max-w-[100px] truncate">
              {profileName}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#141413] flex items-center justify-center text-[#FCFBFA] text-sm font-bold">
              {initial}
            </div>
          </Link>
        ) : (
          // Logged Out: Show a Sign In button that drops them to the landing page form
          <Link href="/login" className="bg-[#141413] text-[#FCFBFA] text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity border-[1.5px] border-[#141413]">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
