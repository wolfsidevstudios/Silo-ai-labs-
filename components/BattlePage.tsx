import React, { useState, useMemo } from 'react';
import { BATTLE_ARENA_ITEMS } from '../constants';
import type { BattleContestant } from '../types';

interface ContestantCardProps {
  contestant: BattleContestant;
  onVote: () => void;
}

const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, onVote }) => {
  return (
    <div
      className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border-2 border-white/10 transition-all duration-300 ease-in-out hover:border-white/50 hover:scale-105"
      onClick={onVote}
    >
      <img
        src={contestant.imageUrl}
        alt={contestant.prompt}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <p className="text-gray-300 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {contestant.prompt}
        </p>
      </div>
       <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-6 py-3 border-2 border-white rounded-full text-white text-xl font-bold backdrop-blur-sm shadow-lg shadow-black/50">
                VOTE
            </div>
        </div>
    </div>
  );
};

const BattlePage: React.FC = () => {
  const [currentBattleIndex, setCurrentBattleIndex] = useState(0);
  
  const handleVote = () => {
    setCurrentBattleIndex(prevIndex => (prevIndex + 1) % BATTLE_ARENA_ITEMS.length);
  };
  
  const currentBattle = useMemo(() => BATTLE_ARENA_ITEMS[currentBattleIndex], [currentBattleIndex]);

  return (
    <div className="animate-fade-in text-center">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">AI Battle Arena</h1>
        <p className="text-lg text-gray-400 mt-2">Vote for the best AI generation. This or That?</p>
      </header>

      <div key={currentBattle.id} className="flex flex-col md:flex-row items-center justify-center gap-8 animate-fade-in">
        <ContestantCard contestant={currentBattle.contestantA} onVote={handleVote} />
        
        <div className="text-4xl font-black text-purple-500 my-4 md:my-0">VS</div>

        <ContestantCard contestant={currentBattle.contestantB} onVote={handleVote} />
      </div>

       <div className="mt-8">
            <p className="text-gray-500 text-sm">
                Battle {currentBattleIndex + 1} of {BATTLE_ARENA_ITEMS.length}
            </p>
        </div>
    </div>
  );
};

export default BattlePage;