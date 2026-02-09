import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle, MessageCircle, MapPin, Search,
  CheckCircle2, X, Briefcase, Tag, Calendar
} from 'lucide-react';

// CONFIGURAÇÃO DO BANCO DE DADOS
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
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* HEADER PREMIUM */}
      <header className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white px-6 pt-12 pb-16 rounded-b-[3.5rem] shadow-2xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                <Briefcase className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-[900] tracking-tighter uppercase italic">Mural SJP</h1>
            </div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 opacity-70">São João da Ponta conectado</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-white text-[#2563EB] px-6 py-3.5 rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
             Anunciar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-10">
        {/* FILTROS ESTILO APP MODERNO */}
        <div className="flex gap-2.5 overflow-x-auto py-6 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-sm border-2 ${filter === cat.id ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-slate-400 border-white hover:border-blue-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTA DE VAGAS */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 opacity-30">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-black text-[10px] uppercase tracking-widest">Sincronizando...</p>
            </div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-[2.5rem] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] border border-slate-100 relative group transition-all">
              
              {/* CATEGORIA EM DESTAQUE NO TOPO */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-xl">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-[900] uppercase tracking-widest">{job.category}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase">
                  <MapPin className="w-3 h-3 text-red-400/60"/>
                  {job.location || 'Centro'}
                </div>
              </div>

              {/* TÍTULO E DESCRIÇÃO */}
              <div className="mb-6">
                <h3 className="text-2xl font-[900] text-slate-800 leading-[1.1] mb-2 uppercase tracking-tight italic">
                  {job.title}
                </h3>
                <div className="pl-4 border-l-4 border-blue-50">
                  <p className="text-slate-500 font-medium text-base leading-relaxed">
                    "{job.description}"
                  </p>
                </div>
              </div>

              {/* RODAPÉ DO CARD */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-[900] text-lg shadow-lg">
                    {job.author ? job.author[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-700 text-sm uppercase">{job.author}</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(job.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleWhatsAppClick(job)} 
                  className="bg-[#22C55E] hover:bg-[#1ca34d] text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-90"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span className="text-xs uppercase tracking-tighter">Chamar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BARRA DE NAVEGAÇÃO FLUTUANTE */}
      <nav className="fixed bottom-8 left-8 right-8 bg-white/80 backdrop-blur-2xl border border-white/30 p-4 flex justify-around max-w-lg mx-auto rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-40">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <CheckCircle2 className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase">Vagas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300">
          <Search className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase">Busca</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-200">
          <div className="w-7 h-7 bg-slate-100 rounded-full border-2 border-white" />
          <span className="text-[9px] font-black uppercase">Conta</span>
        </button>
      </nav>

      {/* MODAL DE POSTAGEM */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3.5rem] p-10 relative animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-slate-300 hover:text-slate-900 transition-colors">
              <X className="w-8 h-8" />
            </button>
            
            <h2 className="text-3xl font-[900] mb-8 text-slate-800 tracking-tighter uppercase italic">O que você precisa?</h2>
            
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="SEU NOME" required className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none transition-all" value={newJob.author} onChange={e => setNewJob({...newJob, author: e.target.value})} />
                <input type="tel" placeholder="WHATSAPP" required className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none transition-all" value={newJob.whatsapp} onChange={e => setNewJob({...newJob, whatsapp: e.target.value})} />
              </div>
              
              <input type="text" placeholder="TÍTULO DO SERVIÇO (EX: DIARISTA)" required className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none transition-all" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />

              <div className="grid grid-cols-2 gap-4">
                <select className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none appearance-none cursor-pointer" value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="BAIRRO" className="w-full bg-slate-50 p-5 rounded-2xl font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none transition-all" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>

              <textarea placeholder="DETALHES DO SERVIÇO..." className="w-full bg-slate-50 p-5 rounded-2xl h-32 font-black text-xs border-2 border-transparent focus:border-blue-500 outline-none resize-none transition-all" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>

              <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-[900] text-sm shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-[0.2em]">Publicar no Mural</button>
            </form>
          </div>
        </div>
      )}

      {/* IMPORTAÇÃO DA FONTE E RESET */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; letter-spacing: -0.02em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}