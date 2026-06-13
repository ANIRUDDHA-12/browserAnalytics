import Link from 'next/link';

export function GlobalHeader() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl bg-white rounded-full px-10 py-4 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between">
      {/* Logomark - Mastercard Inspired */}
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
        <Link href="/projects" className="text-ink font-medium tracking-[-0.02em] hover:text-signal transition-colors">
          Projects
        </Link>
        <Link href="/settings" className="text-ink font-medium tracking-[-0.02em] hover:text-signal transition-colors">
          Settings
        </Link>
      </nav>

      {/* User Profile Chip */}
      <div className="flex items-center">
        <button className="flex items-center gap-2 bg-lifted border-[1.5px] border-ink rounded-full pl-4 pr-1 py-1 hover:bg-putty transition-colors">
          <span className="text-sm font-medium tracking-[-0.02em] text-ink">Admin</span>
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-putty text-xs font-bold">
            AD
          </div>
        </button>
      </div>
    </header>
  );
}
