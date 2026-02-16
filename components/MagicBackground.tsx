
import React from 'react';

const MagicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a1f] overflow-hidden">
      {/* Radial Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-[#1a1a4a] via-[#0a0a1f] to-transparent opacity-60" 
           style={{ background: 'radial-gradient(circle, rgba(46,46,120,0.4) 0%, rgba(10,10,31,1) 70%)' }}>
      </div>
      
      {/* Dotted Grid Pattern */}
      <div className="absolute inset-0 bg-dots opacity-30"></div>
      
      {/* Ambient Floating Orbs */}
      <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-10 animate-pulse delay-1000"></div>
    </div>
  );
};

export default MagicBackground;
