
import React from 'react';

interface ComingSoonPageProps {
  pageName: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ pageName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center p-8 border border-white/20 bg-black/20 rounded-2xl backdrop-blur-md">
        <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-4">{pageName}</h1>
        <p className="text-2xl text-gray-400">Coming Soon</p>
        <p className="text-gray-500 mt-2">This section is under construction. Stay tuned!</p>
         <div className="mt-8 text-4xl animate-pulse">🚀</div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
