
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentBlock: number;
  totalBlocks: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentBlock, totalBlocks }) => {
  const progressPercentage = (currentBlock / totalBlocks) * 100;
  
  const blocks = [
    "Informações de Contato",
    "Informações Gerais",
    "Produtos/Serviços", 
    "Público-Alvo",
    "Prova Social",
    "Design e Estilo",
    "Contato",
    "Objetivo do Site"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="text-xs md:text-sm font-medium text-gray-700">
          Progresso do Briefing
        </div>
        <div className="text-xs md:text-sm font-semibold text-purple-600">
          {currentBlock} de {totalBlocks}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2 md:h-3 mb-1 md:mb-2"
      />
      
      <div className="text-xs text-gray-600 text-center">
        {currentBlock <= totalBlocks ? `🔷 BLOCO ${currentBlock} – ${blocks[currentBlock - 1]}` : "✅ Briefing Finalizado"}
      </div>
    </div>
  );
};

export default ProgressBar;
