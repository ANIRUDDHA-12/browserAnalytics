import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import NewProjectArea from '../components/NewProjectArea'; // Adjust import path if needed
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const cookieStore = cookies();
  
  // 1. Securely connect to Supabase on the Server
  const supabase = await createClient();

  // 2. Identify the user
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Fetch their real projects from the database
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen px-8 pt-32 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#CF4500] block mb-2">
          • REGISTRY
        </span>
        <h1 className="text-4xl font-medium tracking-tight text-[#141413]">
          Your Projects
        </h1>
      </div>

      {/* Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Draw REAL projects from the database */}
        {projects?.map((project) => (
          <div 
            key={project.id}
            className="bg-[#FCFBFA] rounded-[40px] border-[1.5px] border-[#141413] p-8 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_24px_48px_rgba(0,0,0,0,0.04)]"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                {project.domain}
              </span>
              <h2 className="text-2xl font-medium tracking-tight text-[#141413] mt-1">
                {project.name}
              </h2>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-[#696969]">
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
              
              {/* Micro-CTA Circle Link */}
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="w-12 h-12 rounded-full border-[1.5px] border-[#141413] bg-[#FFFFFF] flex items-center justify-center text-[#141413] hover:bg-[#141413] hover:text-[#FCFBFA] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}

        {/* The isolated Client Component Button */}
        <NewProjectArea />
        
      </div>
    </main>
  );
}