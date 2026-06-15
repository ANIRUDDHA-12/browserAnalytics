import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guardrail: If they aren't logged in, kick them to the home page
  if (!user) {
    redirect('/');
  }

  // Fetch their current profile from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  // --- SERVER ACTION 1: Update Profile ---
  // This runs securely on the server when the user hits "Save Changes"
  async function updateProfile(formData: FormData) {
    "use server"; // This magic string tells Next.js to hide this code from the browser
    
    const newName = formData.get('name') as string;
    if (!newName) return;

    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (user) {
      await supabaseServer
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user.id);
        
      // Tell Next.js to refresh the page so the new name instantly shows up
      revalidatePath('/dashboard/settings');
    }
  }

  // --- SERVER ACTION 2: Sign Out ---
  // This runs securely on the server when the user hits "Sign Out"
  async function signOut() {
    "use server";
    
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut(); // Destroys the secure cookie
    redirect('/'); // Sends them back to the login screen
  }

  return (
    <main className="min-h-screen px-8 pt-32 pb-16 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#CF4500] block mb-2">
          • PREFERENCES
        </span>
        <h1 className="text-4xl font-medium tracking-tight text-[#141413]">
          Account Settings
        </h1>
      </div>

      <div className="space-y-8">
        
        {/* Profile Section */}
        <div className="bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[40px] p-8 md:p-12 shadow-[0_24px_48px_rgba(0,0,0,0.02)]">
          <h2 className="text-2xl font-medium text-[#141413] mb-8">Profile Information</h2>
          
          {/* Notice how the form 'action' directly calls our backend function! */}
          <form action={updateProfile} className="max-w-md space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#696969] mb-2">Email Address</label>
              {/* Email is disabled because it's their login identity */}
              <input 
                type="text" 
                disabled 
                value={user.email} 
                className="w-full bg-[#F3F0EE] border-[1.5px] border-[#e0e0e0] text-[#696969] rounded-[12px] px-4 py-3 font-medium cursor-not-allowed" 
              />
              <p className="text-[10px] text-[#696969] mt-2">Email is managed by secure Magic Link authentication.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#696969] mb-2">Display Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={profile?.full_name || ''} 
                placeholder="Your full name" 
                className="w-full bg-[#ffffff] border-[1.5px] border-[#141413] text-[#141413] rounded-[12px] px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#141413]/10 transition-shadow" 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="bg-[#141413] text-[#FCFBFA] px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Security & Sign Out Section */}
        <div className="bg-[#FCFBFA] border-[1.5px] border-[#e0e0e0] rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#141413] transition-colors">
          <div>
            <h2 className="text-xl font-medium text-[#141413] mb-2">Secure Session</h2>
            <p className="text-[#696969] text-sm">Sign out of your current session across all devices.</p>
          </div>
          
          {/* The sign out button gets its own tiny form to trigger the action */}
          <form action={signOut}>
            <button 
              type="submit" 
              className="bg-white border-[1.5px] border-[#141413] text-[#141413] px-8 py-3 rounded-full font-medium hover:bg-[#141413] hover:text-[#FCFBFA] transition-colors duration-200"
            >
              Sign Out
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}