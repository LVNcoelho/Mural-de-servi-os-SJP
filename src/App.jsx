import React, { useState, useRef } from 'react';
import { Camera, Briefcase, Tag, Layout } from 'lucide-react';

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
    { name: 'Vermelho Intenso', class: 'bg-red-600' },
  ];

  const categories = [
    "LIMPEZA", "CONSTRUÇÃO", "EDUCAÇÃO", "FRETES", "BELEZA", "TECNOLOGIA", "REFORÇO", "DIARISTA"
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-4 flex flex-col items-center font-sans pb-20">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">DESIGNER DE CARDS</h1>
          <p className="text-slate-500 font-bold text-sm">Crie posts profissionais para o WhatsApp</p>
        </header>
        
        {/* Preview do Card - DESIGN ATUALIZADO */}
        <div 
          ref={cardRef}
          className={`${bgColor} aspect-square rounded-[1.5rem] p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden border-[8px] border-white/10`}
        >
          {/* Brilhos de fundo */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="z-10 flex justify-between items-center">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Briefcase className="w-4 h-4 text-white" />
              <span className="font-black tracking-[0.2em] text-[10px] uppercase">Mural SJP</span>
            </div>
          </div>

          <div className="z-10 flex flex-col gap-4">
            {/* CATEGORIA - AGORA GRANDE E NO TOPO DO TEXTO */}
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg w-fit shadow-lg transform -rotate-1">
              <Tag className="w-5 h-5 fill-black" />
              <span className="font-black text-xl tracking-tighter">{category}</span>
            </div>
            
            {/* TEXTO PRINCIPAL - FONTE GRANDE E QUADRADA */}
            <h2 className="text-5xl font-black leading-[0.95] whitespace-pre-line tracking-tighter uppercase drop-shadow-md">
              {text}
            </h2>
          </div>

          <div className="bg-white text-black p-5 rounded-2xl flex items-center justify-between shadow-xl z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Acesse o Mural:</p>
              <p className="text-xl font-black tracking-tighter text-blue-600">mural-sjp.vercel.app</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-xl">
               <Layout className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Controles de Edição */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6 border border-gray-100">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">O que você faz?</label>
            <select 
              className="w-full mt-2 p-5 bg-slate-50 rounded-2xl font-black text-slate-700 outline-none cursor-pointer border-2 border-transparent focus:border-blue-500 transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Chamada de Impacto</label>
            <textarea 
              className="w-full mt-2 p-5 bg-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-blue-500/10 resize-none text-xl border-2 border-transparent focus:border-blue-500 transition-all"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Preciso de carpinteiro urgente!"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 text-center block mb-3">Escolha a cor do seu anúncio</label>
            <div className="flex justify-center gap-4">
              {colors.map((c) => (
                <button
                  key={c.class}
                  onClick={() => setBgColor(c.class)}
                  className={`w-12 h-12 rounded-2xl shadow-lg transform active:scale-90 border-4 ${bgColor === c.class ? 'border-blue-200 scale-110' : 'border-transparent'} ${c.class} transition-all`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              onClick={() => window.print()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 transition-all active:scale-95"
            >
              <Camera className="w-7 h-7" /> SALVAR / PRINT
            </button>
            <p className="text-center text-slate-400 text-xs mt-4 font-bold uppercase tracking-widest">Poste no Status e nos Grupos!</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
        @media print {
          .no-print, button, select, textarea, label, h1, header, p { display: none !important; }
          body { background: white; }
          .min-h-screen { padding: 0; }
        }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}