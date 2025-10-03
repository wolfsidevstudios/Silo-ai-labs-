import React from 'react';
import { CLIPS_DATA } from '../constants';
import ClipCard from './ClipCard';

const ClipsPage: React.FC = () => {
  return (
    <div className="flex justify-center animate-fade-in">
        <div className="w-full max-w-md h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory rounded-2xl no-scrollbar">
            {CLIPS_DATA.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
            ))}
        </div>
    </div>
  );
};

export default ClipsPage;
