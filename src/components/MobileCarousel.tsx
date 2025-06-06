import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
const MobileCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cards = [{
    icon: MessageSquare,
    title: "Conversa Inteligente",
    description: "Nossa IA conduzirá uma conversa natural e estruturada para coletar todas as informações da sua empresa de forma organizada.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200"
  }, {
    icon: Sparkles,
    title: "Processo Otimizado",
    description: "Dividimos o briefing em blocos temáticos para garantir que nenhum detalhe importante seja esquecido no desenvolvimento do seu site.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200"
  }, {
    icon: CheckCircle2,
    title: "Dados Seguros",
    description: "Todas as informações coletadas são armazenadas com segurança e utilizadas exclusivamente para o desenvolvimento do seu projeto.",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-200"
  }];
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % cards.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + cards.length) % cards.length);
  };
  return <div className="md:hidden relative">
      {/* Botões de navegação */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={prevSlide} className="w-8 h-8 backdrop-blur-sm mx-[-17px] bg-blue-400 hover:bg-blue-300 text-white">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={nextSlide} className="w-8 h-8 backdrop-blur-sm mx-[-17px] bg-blue-400 hover:bg-blue-300 text-white">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{
        transform: `translateX(-${currentSlide * 100}%)`
      }}>
          {cards.map((card, index) => {
          const IconComponent = card.icon;
          return <div key={index} className="w-full flex-shrink-0 px-4">
                <Card className={`p-4 bg-white/70 backdrop-blur-sm ${card.borderColor} hover:shadow-lg transition-all duration-300 h-48`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{card.title}</h3>
                  </div>
                  <div className="text-center pb-4">
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Card>
              </div>;
        })}
        </div>
      </div>
      
      {/* Indicadores de slides */}
      <div className="flex justify-center mt-4 space-x-2">
        {cards.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'}`} />)}
      </div>
    </div>;
};
export default MobileCarousel;