"use client";

import React, { useState } from 'react';
import { useRetell } from '../hooks/useRetell';
import { Mic, PhoneOff, Loader2, AlertCircle, X, HelpCircle, Lock } from 'lucide-react';

interface VoiceWidgetProps {
  agent_id: string;
  brand: string;
}

export function VoiceWidget({ agent_id, brand }: VoiceWidgetProps) {
  const { callStatus, errorMsg, isMicDenied, startCall, stopCall, dismissMicError } = useRetell();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      
      {/* Tooltip explaining what the button does */}
      {showTooltip && callStatus === 'idle' && !isMicDenied && (
        <div className="bg-white text-slate-800 p-4 rounded-xl shadow-2xl border border-slate-100 max-w-xs flex flex-col gap-2 relative" style={{ animation: '0.2s ease-out 0s 1 normal forwards running fadeIn' }}>
          <button onClick={() => setShowTooltip(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 pr-4">
            <Mic size={16} className="text-blue-600" /> AI Voice Assistant
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have a question? Click the microphone below to talk directly with our autonomous AI consultant.
          </p>
        </div>
      )}

      {/* Microphone Denied Instructional Modal */}
      {isMicDenied && (
        <div className="bg-white text-slate-800 p-5 rounded-xl shadow-2xl border border-slate-200 max-w-sm flex flex-col gap-3 relative" style={{ animation: '0.2s ease-out 0s 1 normal forwards running fadeIn' }}>
          <button onClick={dismissMicError} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 text-red-600 font-semibold pr-4">
            <AlertCircle size={18} /> Microphone Access Blocked
          </div>
          <p className="text-sm text-slate-600">
            To speak with the AI assistant, your browser needs permission to use the microphone.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 flex flex-col gap-2 mt-1">
            <div className="flex items-start gap-2">
              <Lock size={16} className="mt-0.5 text-slate-500 shrink-0" />
              <span>1. Click the <strong>Lock icon</strong> in your browser's address bar (at the top).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-500 w-4 text-center shrink-0">2.</span>
              <span>Find the <strong>Microphone</strong> setting and toggle it on or switch to "Allow".</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-500 w-4 text-center shrink-0">3.</span>
              <span><strong>Refresh the page</strong> and click the mic button again.</span>
            </div>
          </div>
          <button onClick={dismissMicError} className="mt-2 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Got it, I'll fix this
          </button>
        </div>
      )}

      {/* Standard Error Message */}
      {errorMsg && !isMicDenied && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm max-w-xs">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      
      {/* Main Mic Button Row */}
      <div className="flex items-center gap-2">
        {callStatus === 'idle' && !isMicDenied && (
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-2 rounded-full bg-white shadow-md text-slate-400 hover:text-slate-600 border border-slate-100 transition-colors"
            aria-label="What is this?"
          >
            <HelpCircle size={20} />
          </button>
        )}
        
        <button
          onClick={callStatus === 'active' || callStatus === 'connecting' ? stopCall : () => { setShowTooltip(false); startCall(agent_id, brand); }}
          disabled={callStatus === 'connecting'}
          className={`flex items-center justify-center p-4 rounded-full shadow-xl transition-all duration-200 ${
            callStatus === 'active' 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
              : callStatus === 'connecting'
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-black hover:bg-slate-800 text-white shadow-black/20'
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
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
