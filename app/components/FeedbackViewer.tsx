"use client"

import { use, useState } from "react"
import Link from "next/link"

interface Feedback{
    id:string,
    emotion:string,
    message:string,
    url:string,
    category:string,
    created_at:string,
    browser_metadata:{
        userAgent:string,
        viewportWidth:number,
        viewportHeight:number,
        language:string
    },
    screenshot?:string

}

interface Project{
    name:string,
    id:string
}

export default function FeedbackViewer({project,initialFeedback}:{project:Project,initialFeedback:Feedback[]}){

    const [selectedFeedback,setSelectedFeedback] = useState<Feedback | null>(initialFeedback[0] || null)

    const getEmotionEmoji = (emotion:string)=>{
        if(emotion === "love")  return '😍'
        if(emotion == "thinking") return '🤔'
        return '🐛'
    }

    // to display the creation date ie "created 2 days ago etc"
    const formatDate = (dateString:string)=>{
        const date = new Date(dateString)
        return date.toLocaleString('en-us',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})
    }

    return(
        <main className="min-h-screen px-8 pt-32 pb-16 max-w-7xl mx-auto">
      {/* Back Navigation and Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm font-medium text-[#696969] hover:text-[#141413] flex items-center gap-2 mb-4 w-fit">
          ← Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#CF4500] block mb-2">
              • LIVE INSTANCES
            </span>
            <h1 className="text-4xl font-medium tracking-tight text-[#141413]">
              Context: {project.name}
            </h1>
          </div>

          {/* Active Integration Script Utility Box */}
          <div className="bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[20px] p-4 text-xs font-mono text-[#141413] max-w-md">
         <span className="font-sans font-bold block text-[#696969] uppercase tracking-wider mb-1">Your Widget Script Token</span>
      {/* Dynamically pulls the domain from Vercel or localhost, and includes 'defer' */}
      {`<script src="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/widget.js" data-project-id="${project.id}" defer></script>`}
      </div>
        </div>
      </div>

        {/* Split Interface Container */}
      {initialFeedback.length === 0 ? (
        <div className="bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[40px] p-16 text-center shadow-sm">
          <p className="text-[#696969] font-medium">No feedback loops recorded yet for this active instance tag.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: List Feed Stream */}
          <div className="lg:col-span-5 space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
            {initialFeedback.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedFeedback(item)}
                className={`w-full text-left p-6 rounded-[20px] border-[1.5px] transition-all flex gap-4 ${
                  selectedFeedback?.id === item.id
                    ? 'bg-[#141413] border-[#141413] text-[#FCFBFA]'
                    : 'bg-[#FCFBFA] border-[#141413] text-[#141413] hover:shadow-[0_4px_24px_rgba(0,0,0,0,0.04)]'
                }`}
              >
                <div className="text-2xl bg-white w-12 h-12 rounded-full flex items-center justify-center border border-[#141413] shadow-sm shrink-0">
                  {getEmotionEmoji(item.emotion)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs px-3 py-0.5 rounded-full font-medium border ${
                      selectedFeedback?.id === item.id 
                        ? 'bg-[#696969] border-[#696969] text-white' 
                        : 'bg-white border-[#141413] text-[#141413]'
                    }`}>
                      {item.category}
                    </span>
                    <span className={`text-xs ${selectedFeedback?.id === item.id ? 'text-[#696969]' : 'text-[#696969]'}`}>
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-normal line-clamp-2 mt-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Complete Analytical Breakout */}
          {selectedFeedback && (
            <div className="lg:col-span-7 bg-[#FCFBFA] border-[1.5px] border-[#141413] rounded-[40px] p-8 space-y-6 shadow-[0_24px_48px_rgba(0,0,0,0,0.02)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#CF4500] block mb-2">
                  • INSIGHT SPECIFICATION
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getEmotionEmoji(selectedFeedback.emotion)}</span>
                  <h3 className="text-xl font-medium text-[#141413]">Category: {selectedFeedback.category}</h3>
                </div>
                <p className="text-[#141413] text-lg font-normal leading-relaxed bg-[#F3F0EE] p-6 rounded-[20px] border-[1.5px] border-[#141413]">
                  "{selectedFeedback.message}"
                </p>
              </div>

              {/* Technical Footprint Section */}
              <div className="border-[1.5px] border-[#141413] rounded-[20px] p-6 space-y-3 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-2">Technical Context</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#696969] block">Target Source Uniform Resource Locator</span>
                    <a href={selectedFeedback.url} target="_blank" rel="noreferrer" className="text-[#141413] font-medium break-all underline hover:text-[#CF4500]">
                      {selectedFeedback.url}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#696969] block">Viewport Matrix Dimensions</span>
                    <span className="text-[#141413] font-mono font-medium">
                      {selectedFeedback.browser_metadata.viewportWidth}px × {selectedFeedback.browser_metadata.viewportHeight}px
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#696969] block">Client Agent String</span>
                    <span className="text-[#141413] font-mono break-all font-medium">
                      {selectedFeedback.browser_metadata.userAgent}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Dom Capture Image Block */}
             {/* Target Dom Capture Image Block */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-2">DOM Screen Capture</h4>
                <div className="aspect-video bg-[#141413] rounded-[24px] overflow-hidden border-[1.5px] border-[#141413] flex items-center justify-center relative group">
                  
                  {/* If we have a screenshot, draw it. Otherwise, show your SVG placeholder. */}
                  {selectedFeedback.screenshot ? (
                    <img 
                      src={selectedFeedback.screenshot} 
                      alt="Captured DOM Context" 
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#696969] mx-auto mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                      </svg>
                      <p className="text-xs text-[#696969] font-medium">Client-Masked Context Canvas Placeholder</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}
        </div>
      )}
      </main>
    )
}