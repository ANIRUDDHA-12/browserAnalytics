"use client"
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter()
  const supabase = createClient()


  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Get the current securely logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }

    // 2. Insert into your public.projects table
    const { error: insertError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id, // Satisfies your NOT NULL and RLS policy
        name: name,
        domain: domain,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      // 3. Clean up and refresh the dashboard
      setName('');
      setDomain('');
      setLoading(false);
      onClose();
      router.refresh(); // Tells Next.js to fetch the new list of projects from the server
    }
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[40px] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.08)] relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full border-[1.5px] border-[#141413] flex items-center justify-center text-[#141413] hover:bg-[#F3F0EE] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-[#CF4500] block mb-6">
          • INITIALIZE CONTEXT
        </span>

        <h2 className="text-2xl font-medium tracking-tight text-[#141413] mb-6">
          New Project
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-[#F3F0EE] border-[1.5px] border-[#CF4500] text-[#CF4500] text-sm font-medium rounded-[20px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#141413] mb-2">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp Blog"
              className="w-full bg-[#F3F0EE] border-[1.5px] border-[#141413] rounded-[20px] px-4 py-3 text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#141413]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#141413] mb-2">Target Domain</label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="acme.com"
              className="w-full bg-[#F3F0EE] border-[1.5px] border-[#141413] rounded-[20px] px-4 py-3 text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#141413]/20"
            />
            <p className="text-xs text-[#696969] mt-2">Do not include https:// or www.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#141413] text-[#FCFBFA] rounded-[20px] py-3 font-medium hover:bg-[#696969] transition-colors disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize Context'}
          </button>
        </form>

      </div>
    </div>
  );
}
