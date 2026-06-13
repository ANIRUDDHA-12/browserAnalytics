"use client";

import { useState } from 'react';
import { CreateProjectModal } from './CreateProjectModal';

export default function NewProjectArea() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border-[1.5px] border-dashed border-ink/30 rounded-[40px] flex flex-col items-center justify-center py-16 px-4 text-center bg-putty/50 h-full">
        <p className="text-ink font-medium mb-6">
          Add another domain context to monitor feedback loops.
        </p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-ink text-putty px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          + New Project
        </button>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}