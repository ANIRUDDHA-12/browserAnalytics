import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The Bouncer: This only runs for URLs that start with /dashboard
  if (!user) {
    redirect('/'); 
  }

  // If they are logged in, just pass them through to the dashboard pages
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}