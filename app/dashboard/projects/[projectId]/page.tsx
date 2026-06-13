import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import FeedbackViewer from "@/app/components/FeedbackViewer";

// the folder name is to be matched properly in it my foldername is [projectId] so i would use params.projectId

export default async function ProjectDetailsPage({params}:{params:Promise<{projectId:string}>}){
  const supabase = await createClient()
  const resolvedParams = await params;

  const {data:project,error:projectError} = await supabase
  .from('projects')
  .select('id,name')
  .eq('id',resolvedParams.projectId)
  .single()

  if(projectError){
    console.error("Supabase Error",projectError.message)
    notFound()
  }

  if(!project){
    console.error("No Project In DB")
    notFound()
  }


  const {data:feedbacks,error:feedbackError} = await supabase
  .from('feedbacks')
  .select('*')
  .eq('project_id',project.id)
  .order('created_at',{ascending:false})

  return(
    <FeedbackViewer  
    project={project}
    initialFeedback={feedbacks || []}
    />
  )
}