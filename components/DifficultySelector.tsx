
import React from 'react';
import { Difficulty } from '../types';
import { Coffee, Wand2, Eye } from 'lucide-react';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selected, onSelect }) => {
  const options = [
    { id: Difficulty.MUGGLE, label: 'מוגל', icon: Coffee },
    { id: Difficulty.WIZARD, label: 'קוסם', icon: Wand2 },
    { id: Difficulty.MASTER, label: 'מאסטר', icon: Eye },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <h3 className="text-[#8e7aff] text-xs font-bold tracking-[0.2em] mb-6 uppercase">בחר את המסלול שלך</h3>
      
      <div className="relative flex items-center justify-between w-full bg-[#151532]/50 border border-[#2d2d5a] rounded-full p-2 px-4">
        {options.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="relative z-10 flex flex-col items-center justify-center group"
            >
              <div className={`
                w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-[#6b46ff] to-[#4c2eff] shadow-[0_0_20px_rgba(107,70,255,0.6)] border border-[#8e7aff]' 
                  : 'bg-[#1a1a3a] border border-[#2d2d5a] group-hover:border-[#4c2eff]/50'
                }
              `}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-[#5d5d8a]'}`} />
              </div>
              <span className={`text-[10px] mt-2 font-bold tracking-widest transition-colors ${isSelected ? 'text-white' : 'text-[#5d5d8a]'}`}>
                {option.label}
              </span>
              
              {isSelected && (
                <div className="absolute -inset-1 bg-[#6b46ff] blur-xl opacity-20 -z-10 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
