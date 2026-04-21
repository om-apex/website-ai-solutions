import { useState, useEffect, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

export function useRetell() {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMicDenied, setIsMicDenied] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    // Initialize the SDK
    const retellClient = new RetellWebClient();
    retellClientRef.current = retellClient;

    retellClient.on('call_started', () => {
      setCallStatus('active');
      setIsMicDenied(false);
    });

    retellClient.on('call_ended', () => {
      setCallStatus('idle');
    });

    retellClient.on('error', (error: any) => {
      setCallStatus('error');
      setErrorMsg(error?.message || 'An error occurred during the call');
    });

    retellClient.on('update', (update: any) => {
      // handle updates if needed
    });

    return () => {
      retellClient.stopCall();
      retellClientRef.current = null;
    };
  }, []);

  const startCall = async (agent_id: string, brand: string) => {
    try {
      setCallStatus('connecting');
      setErrorMsg(null);
      setIsMicDenied(false);

      // Request microphone permissions explicitly before connecting to prevent hanging connections
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setIsMicDenied(true);
        setCallStatus('idle');
        return; // Stop execution without throwing
      }

      // Fetch access token from backend
      const response = await fetch('https://om-cortex.onrender.com/api/retell/web-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id, brand }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;

      if (!accessToken) {
        throw new Error('No access token received from backend');
      }

      // Start the call using the token
      if (retellClientRef.current) {
        await retellClientRef.current.startCall({
          accessToken,
        });
      }
    } catch (err: any) {
      setCallStatus('error');
      setErrorMsg(err.message || 'Failed to start call');
    }
  };

  const stopCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
      setCallStatus('idle');
    }
  };
  
  const dismissMicError = () => {
    setIsMicDenied(false);
  };

  return {
    callStatus,
    errorMsg,
    isMicDenied,
    startCall,
    stopCall,
    dismissMicError,
  };
}
