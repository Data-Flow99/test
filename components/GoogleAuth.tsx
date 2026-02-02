
import React, { useEffect, useState, useRef } from 'react';
import { User } from '../types';
import { Shield, Loader2, AlertCircle, UserCheck } from 'lucide-react';

// Declare google as a global variable to satisfy TypeScript compiler
declare var google: any;

interface GoogleAuthProps {
  onLogin: (user: User) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [gsiError, setGsiError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initializeGoogleOneTap = () => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        try {
          // NOTE: You must replace this with a valid Client ID from the Google Cloud Console (https://console.cloud.google.com/)
          // This specific placeholder causes the 'Client ID not found' error.
          const clientId = "YOUR_REAL_CLIENT_ID.apps.googleusercontent.com"; 
          
          if (clientId.includes("YOUR_REAL_CLIENT_ID")) {
            setGsiError("Configuration Required: Please set a valid Google Client ID in components/GoogleAuth.tsx");
            initialized.current = true;
            return;
          }

          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            use_fedcm_for_prompt: false,
            cancel_on_tap_outside: true,
          });

          const btnParent = document.getElementById("googleLoginBtn");
          if (btnParent) {
            google.accounts.id.renderButton(
              btnParent,
              { 
                theme: "filled_blue", 
                size: "large", 
                width: 280, 
                shape: "pill",
                text: "signin_with",
              }
            );
          }

          google.accounts.id.prompt((notification: any) => {
            if (notification.isDisplayMoment() && notification.isNotDisplayed()) {
              console.debug("One Tap skipped:", notification.getNotDisplayedReason());
            }
          });
          
          initialized.current = true;
        } catch (err) {
          console.error("GSI Init Error:", err);
          setGsiError("Identity Service Unavailable");
        }
      } else {
        // Retry if script not yet loaded
        const timer = setTimeout(initializeGoogleOneTap, 1000);
        return () => clearTimeout(timer);
      }
    };

    const handleCredentialResponse = (response: any) => {
      setLoading(true);
      // In a real app, send response.credential to your backend for verification
      setTimeout(() => {
        const mockUser: User = {
          id: 'google-123',
          name: 'Strategic Agent',
          email: 'agent@polaris.os',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Polaris',
          role: 'Executive'
        };
        onLogin(mockUser);
        setLoading(false);
      }, 800);
    };

    initializeGoogleOneTap();
  }, [onLogin]);

  const handleGuestLogin = () => {
    onLogin({
      id: 'demo-user',
      name: 'Guest Strategist',
      email: 'guest@polaris.os',
      picture: '',
      role: 'Consultant'
    });
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-12 glass rounded-[2.5rem] border-slate-700/50 shadow-2xl relative overflow-hidden max-w-md w-full animate-in zoom-in duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 -z-10" />
      
      <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-2">
        <Shield className="w-10 h-10 text-white" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Polaris OS</h1>
        <p className="text-slate-400 text-sm font-medium">Cognitive Operating System for the New Era</p>
      </div>

      <div className="w-full space-y-6">
        {gsiError ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Auth Warning</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Google Login is disabled because a valid <code className="text-blue-400">Client ID</code> was not provided in the source code.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center min-h-[50px]">
            <div id="googleLoginBtn"></div>
          </div>
        )}
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-[#020617] px-4 text-slate-600">Secure Access</span></div>
        </div>

        <button 
          onClick={handleGuestLogin}
          className="w-full group flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
        >
          <UserCheck className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
          <span>Enter as Guest Node</span>
        </button>
        
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Verifying Protocol...</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Secured via Polaris Auth Gateway
        </div>
      </div>
      
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 blur-[80px]" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 blur-[80px]" />
    </div>
  );
};

export default GoogleAuth;
