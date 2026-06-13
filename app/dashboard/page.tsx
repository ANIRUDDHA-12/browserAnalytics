import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import NewProjectArea from '../components/NewProjectArea'; 

export default async function DashboardPage() {
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

  // --- SERVER ACTION: Delete Project ---
  // This securely deletes the project and instantly refreshes the page
  async function deleteProject(formData: FormData) {
    "use server";
    const projectId = formData.get('projectId') as string;
    if (!projectId) return;

    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (user) {
      await supabaseServer
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id); // Extra security: ensure they own the project
      
      revalidatePath('/dashboard');
    }
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* IMPROVEMENT 1: The New Project Area is now FIRST so it never gets lost! */}
        <NewProjectArea />
        
        {/* Draw REAL projects from the database */}
        {projects?.map((project) => (
          <div 
            key={project.id}
            className="bg-[#FCFBFA] rounded-[40px] border-[1.5px] border-[#141413] p-8 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_24px_48px_rgba(0,0,0,0.04)] relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                  {project.domain || "Domain Config"}
                </span>
                <h2 className="text-2xl font-medium tracking-tight text-[#141413] mt-1 line-clamp-1">
                  {project.name}
                </h2>
              </div>

              {/* IMPROVEMENT 2: Pure CSS Dropdown for the Delete Menu */}
              <div className="relative group/menu">
                <button className="p-2 -mr-2 text-[#696969] hover:text-[#141413] hover:bg-[#F3F0EE] rounded-full transition-colors cursor-pointer">
                  {/* Kebab Menu Icon (3 Dots) */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>

                {/* The Dropdown Box (Hidden until hovered) */}
                <div className="absolute right-0 top-full mt-1 w-40 bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[16px] shadow-[0_12px_24px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                  <form action={deleteProject}>
                    {/* Hidden input to pass the ID to the Server Action */}
                    <input type="hidden" name="projectId" value={project.id} />
                    <button 
                      type="submit" 
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#CF4500] hover:bg-[#F3F0EE] transition-colors"
                    >
                      Delete Project
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
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
        
      </div>
    </main>
  );
}