import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle, MessageCircle, MapPin, Filter, Search,
  CheckCircle2, Clock, X, Briefcase, Tag
} from 'lucide-react';

// CREDENCIAIS CONFIGURADAS
const supabaseUrl = 'https://sknvpkauajwudoqojukf.supabase.co';
const supabaseKey = 'sb_publishable_ykl5x46QGcdpVcSb2jUtaw_OWQxTmU5';
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'construcao', name: 'Construção' },
  { id: 'limpeza', name: 'Limpeza' },
  { id: 'educacao', name: 'Educação' },
  { id: 'fretes', name: 'Fretes' },
  { id: 'beleza', name: 'Beleza' },
  { id: 'tecnologia', name: 'Tecnologia' }
];

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '', category: 'Limpeza', location: '', description: '', author: '', whatsapp: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erro:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleWhatsAppClick = (job) => {
    const cleanPhone = job.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${job.author}, vi seu anúncio "${job.title}" no Mural SJP!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: newJob.title,
          description: newJob.description,
          category: newJob.category.toUpperCase(),
          location: newJob.location,
          author: newJob.author,
          whatsapp: newJob.whatsapp
        }]).select();
      if (error) throw error;
      setJobs([data[0], ...jobs]);
      setShowModal(false);
      setNewJob({ title: '', category: 'Limpeza', location: '', description: '', author: '', whatsapp: '' });
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const filteredJobs = filter === 'todos' ? jobs : jobs.filter(j => j.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-28 font-sans">
      {/* HEADER ROBUSTO */}
      <header className="bg-[#2563EB] text-white px-6 py-8 rounded-b-[2rem] shadow-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-7 h-7" />
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Mural SJP</h1>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white text-[#2563EB] px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <PlusCircle className="w-4 h-4" /> POSTAR
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-6">
        {/* FILTROS MAIS COMPACTOS */}
        <div className="flex gap-2 overflow-x-auto py-5 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider border-2 transition-all ${filter === cat.id ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-slate-400 border-transparent'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTA DE VAGAS COM "BANHO DE LOJA" */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 font-black text-slate-300 uppercase tracking-widest">Carregando...</div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
              
              {/* ÁREA DE ATUAÇÃO - AGORA ACIMA E MAIOR */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-blue-600 font-black text-xs uppercase tracking-[0.1em]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
                  <MapPin className="w-3 h-3 text-red-400"/>
                  {job.location}
                </div>
              </div>

              {/* TÍTULO DA VAGA - FONTE QUADRADA E FORTE */}
              <h3 className="text-xl font-black text-slate-800 leading-tight mb-1 uppercase tracking-tight">
                {job.title}
              </h3>
              
              <p className="text-slate-500 font-medium text-sm leading-snug mb-5 italic">
                "{job.description}"
              </p>

              {/* RODAPÉ DO CARD MAIS JUSTO */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-white font-black text-sm uppercase">
                    {job.author ? job.author[0] : 'S'}
                  </div>
                  <div>
                    <p className="font-black text-slate-700 text-xs uppercase leading-none">{job.author}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{new Date(job.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleWhatsAppClick(job)} 
                  className="bg-[#22C55E] text-white px-4 py-2.5 rounded-xl font-black text-[10px] flex items-center gap-2 shadow-md active:scale-95 transition-all uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  CHAMAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* NAV INFERIOR ESTILO APLICATIVO */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 p-3 flex justify-around max-w-2xl mx-auto rounded-2xl shadow-xl z-40">
        <button className="p-2 text-blue-600"><CheckCircle2 className="w-6 h-6" /></button>
        <button className="p-2 text-slate-300"><Search className="w-6 h-6" /></button>
        <button className="p-2 text-slate-300"><div className="w-6 h-6 bg-slate-100 rounded-full border border-slate-200" /></button>
      </nav>

      {/* MODAL AJUSTADO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] p-8 relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-300 hover:text-slate-600">
              <X className="w-7 h-7" />
            </button>
            <h2 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-tighter italic">Novo Bico</h2>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="SEU NOME" required className="w-full bg-slate-50 p-4 rounded-xl font-bold text-xs border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.author} onChange={e => setNewJob({...newJob, author: e.target.value})} />
                <input type="tel" placeholder="ZAP (919...)" required className="w-full bg-slate-50 p-4 rounded-xl font-bold text-xs border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.whatsapp} onChange={e => setNewJob({...newJob, whatsapp: e.target.value})} />
              </div>
              <input type="text" placeholder="TÍTULO DO SERVIÇO" required className="w-full bg-slate-50 p-4 rounded-xl font-bold text-xs border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              <div className="flex gap-3">
                <select className="w-1/2 bg-slate-50 p-4 rounded-xl font-bold text-xs outline-none cursor-pointer" value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="BAIRRO" className="w-1/2 bg-slate-50 p-4 rounded-xl font-bold text-xs border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <textarea placeholder="DESCRIÇÃO..." className="w-full bg-slate-50 p-4 rounded-xl h-24 font-bold text-xs border-2 border-transparent focus:border-blue-500 outline-none resize-none" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              <button className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">PUBLICAR NO MURAL</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}