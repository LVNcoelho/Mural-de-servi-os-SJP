import React, { useState, useRef } from 'react';
import { Camera, Briefcase, Tag } from 'lucide-react';

export default function App() {
  const [text, setText] = useState("Precisa de alguém para um serviço?\nEncontre profissionais aqui!");
  const [category, setCategory] = useState("LIMPEZA");
  const [bgColor, setBgColor] = useState('bg-blue-600');
  const cardRef = useRef(null);

  const colors = [
    { name: 'Azul Mural', class: 'bg-blue-600' },
    { name: 'Verde Zap', class: 'bg-green-500' },
    { name: 'Roxo Moderno', class: 'bg-purple-600' },
    { name: 'Preto Elegante', class: 'bg-slate-900' },
  ];

  const categories = [
    "LIMPEZA", "CONSTRUÇÃO", "EDUCAÇÃO", "FRETES", "BELEZA", "TECNOLOGIA", "OUTROS"
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center font-sans">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-black text-center text-slate-800 tracking-tight">Criador de Posts SJP</h1>
        
        {/* Preview do Card - Estilo Quadrado e Robusto */}
        <div 
          ref={cardRef}
          className={`${bgColor} aspect-square rounded-[2rem] p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden`}
          style={{ fontFamily: '"Inter", "system-ui", sans-serif' }}
        >
          {/* Elementos Decorativos de fundo */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg text-blue-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-black tracking-[0.2em] text-[10px] uppercase opacity-90">Mural SJP</span>
            </div>
          </div>

          <div className="z-10 flex flex-col gap-2">
            {/* CATEGORIA EM DESTAQUE NO TOPO */}
            <div className="flex items-center gap-2 text-yellow-300 font-black text-xl tracking-widest italic">
              <Tag className="w-5 h-5" />
              <span>{category}</span>
            </div>
            
            {/* TEXTO DA VAGA COM FONTE QUADRADA */}
            <h2 className="text-4xl font-black leading-[1.05] whitespace-pre-line tracking-tight uppercase">
              {text}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Acesse agora:</p>
            <p className="text-xl font-black tracking-tight">mural-sjp.vercel.app</p>
          </div>
        </div>

        {/* Controles de Edição */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Categoria do Bico</label>
            <select 
              className="w-full mt-2 p-4 bg-gray-50 rounded-xl font-bold outline-none cursor-pointer border border-transparent focus:border-blue-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Chamada Principal</label>
            <textarea 
              className="w-full mt-2 p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 ring-blue-500/20 resize-none text-lg"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cor do Fundo</label>
            <div className="flex gap-3 mt-2">
              {colors.map((c) => (
                <button
                  key={c.class}
                  onClick={() => setBgColor(c.class)}
                  className={`w-12 h-12 rounded-2xl border-4 ${bgColor === c.class ? 'border-white shadow-lg scale-110' : 'border-transparent'} ${c.class} transition-all`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <p className="text-sm text-gray-400 text-center font-bold italic">
              📸 Prepare o texto e tire um print para postar!
            </p>
            <button 
              onClick={() => window.print()}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-xl shadow-blue-100"
            >
              <Camera className="w-6 h-6" /> GERAR PDF / PRINT
            </button>
          </div>
        </div>
      </div>
      
      {/* Estilos para ocultar controles na hora do print se desejar usar a função do navegador */}
      <style>{`
        @media print {
          .no-print, button, select, textarea, label, h1 { display: none !important; }
          body { background: white; }
          .min-h-screen { padding: 0; }
        }
      `}</style>
    </div>
  );
}