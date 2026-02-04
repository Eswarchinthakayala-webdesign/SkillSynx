import React from 'react';

export const Logo = ({ className }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#4F46E5"/>
              <stop offset="100%" stopColor="#22D3EE"/>
            </linearGradient>
          </defs>
          
          {/* Main Shape: Abstract S / Synapse */}
          <path 
            d="M70 25 C 50 25, 50 25, 50 50 C 50 75, 50 75, 30 75" 
            stroke="url(#logoGradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
          />
          
          {/* Connection Nodes */}
          <circle cx="70" cy="25" r="9" fill="#22D3EE" />
          <circle cx="30" cy="75" r="9" fill="#4F46E5" />
          
          {/* Pulse Ring */}
          <circle cx="50" cy="50" r="22" stroke="white" strokeWidth="2" opacity="0.2" strokeDasharray="6 6" className="animate-[spin_10s_linear_infinite]" style={{transformOrigin: '50px 50px'}} />
          
          {/* Central Node */}
          <circle cx="50" cy="50" r="7" fill="white" />
        </svg>
      </div>
      
      <span className="font-bold text-xl tracking-tight text-foreground flex items-center gap-0.5">
        Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Synx</span>
      </span>
    </div>
  );
};

export default Logo;
