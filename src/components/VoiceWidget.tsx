"use client";

import React from 'react';
import { useRetell } from '../hooks/useRetell';
import { Mic, PhoneOff, Loader2, AlertCircle } from 'lucide-react';

interface VoiceWidgetProps {
  agent_id: string;
  brand: string;
}

export function VoiceWidget({ agent_id, brand }: VoiceWidgetProps) {
  const { callStatus, errorMsg, startCall, stopCall } = useRetell();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm max-w-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      
      <button
        onClick={callStatus === 'active' || callStatus === 'connecting' ? stopCall : () => startCall(agent_id, brand)}
        disabled={callStatus === 'connecting'}
        className={`flex items-center justify-center p-4 rounded-full shadow-xl transition-all duration-200 ${
          callStatus === 'active' 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : callStatus === 'connecting'
            ? 'bg-slate-400 text-white cursor-not-allowed'
            : 'bg-black hover:bg-slate-800 text-white'
        }`}
        aria-label={callStatus === 'active' ? 'End call' : 'Start call'}
      >
        {callStatus === 'active' ? (
          <PhoneOff size={24} />
        ) : callStatus === 'connecting' ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Mic size={24} />
        )}
      </button>
    </div>
  );
}
