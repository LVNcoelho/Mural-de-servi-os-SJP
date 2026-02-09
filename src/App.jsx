import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle, MessageCircle, MapPin, Search,
  CheckCircle2, X, Briefcase, Tag, Calendar, Filter
} from 'lucide-react';

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
          location: newJob.location || 'São João da Ponta',
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
    <div className="min-h-screen bg-[#F1F5F9] pb-32 font-sans">
      {/* HEADER REDUZIDO E MODERNO */}
      <header className="bg-[#2563EB] text-white px-6 py-8 shadow-md">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Mural SJP</h1>
            <p className="text-blue-100 text-xs opacity-90">São João da Ponta conectado</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-white text-[#2563EB] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-blue-50 transition-colors"
          >
            Anunciar
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6">
        {/* FILTROS IGUAIS AO PRINT */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
          <div className="p-2 text-slate-400 border-r border-slate-200 pr-3">
             <Filter className="w-5 h-5" />
          </div>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === cat.id 
                ? 'bg-[#3B82F6] text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTA DE VAGAS LIMPA */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium">Buscando oportunidades...</p>
            </div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              
              {/* CATEGORIA E LOCALIZAÇÃO */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-50 text-[#3B82F6] px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {job.category}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {job.location || 'São João da Ponta'}
                </div>
              </div>

              {/* TÍTULO E DESCRIÇÃO SEM ITÁLICO */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {job.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed italic">
                  "{job.description}"
                </p>
              </div>

              {/* RODAPÉ DO CARD */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                    {job.author ? job.author[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-sm">{job.author}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(job.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleWhatsAppClick(job)} 
                  className="bg-[#22C55E] hover:bg-[#1ca34d] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="text-sm">Chamar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BARRA DE NAVEGAÇÃO MAIS DISCRETA */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-slate-200 p-3 flex justify-around rounded-full shadow-lg z-40">
        <button className="flex flex-col items-center gap-0.5 text-blue-600">
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Vagas</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Busca</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400">
          <div className="w-6 h-6 bg-slate-100 rounded-full border border-slate-200" />
          <span className="text-[10px] font-bold uppercase">Conta</span>
        </button>
      </nav>

      {/* MODAL AJUSTADO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-400">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-slate-800">Novo Anúncio</h2>
            
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Seu Nome</label>
                  <input type="text" required className="w-full bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 focus:border-blue-500 outline-none" value={newJob.author} onChange={e => setNewJob({...newJob, author: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                  <input type="tel" required className="w-full bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 focus:border-blue-500 outline-none" value={newJob.whatsapp} onChange={e => setNewJob({...newJob, whatsapp: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">O que você precisa?</label>
                <input type="text" placeholder="Ex: Preciso de uma diarista" required className="w-full bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 focus:border-blue-500 outline-none" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Categoria</label>
                  <select className="w-full bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 focus:border-blue-500 outline-none appearance-none" value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})}>
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Bairro/Local</label>
                  <input type="text" placeholder="Centro" className="w-full bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 focus:border-blue-500 outline-none" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Detalhes</label>
                <textarea placeholder="Descreva o serviço..." className="w-full bg-slate-50 p-3 rounded-xl h-24 text-sm border border-slate-100 focus:border-blue-500 outline-none resize-none" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all">Publicar Agora</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}