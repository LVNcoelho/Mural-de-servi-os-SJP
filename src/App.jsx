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
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
      {/* HEADER IGUAL AO DA FOTO */}
      <header className="bg-[#2563EB] text-white px-6 py-10 rounded-b-[3rem] shadow-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              <h1 className="text-3xl font-black tracking-tight">Mural SJP</h1>
            </div>
            <p className="text-blue-100 text-sm mt-1 opacity-90">São João da Ponta conectado</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white text-[#2563EB] px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" /> Postar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-6">
        {/* FILTROS ARREDONDADOS */}
        <div className="flex gap-3 overflow-x-auto py-8 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              className={`px-7 py-3 rounded-full font-bold whitespace-nowrap border-2 transition-all ${filter === cat.id ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-400 border-transparent shadow-sm'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTA DE VAGAS COM O ESPAÇAMENTO DA FOTO */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">Carregando...</div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all">
              
              {/* ÁREA DE ATUAÇÃO - ACIMA E MAIOR */}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-[#2563EB] px-4 py-1.5 rounded-xl flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-[13px] font-black uppercase tracking-widest">{job.category}</span>
                </div>
                <div className="text-gray-400 text-xs font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400"/>
                  {job.location}
                </div>
              </div>

              {/* TÍTULO DA VAGA */}
              <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                {job.title}
              </h3>
              
              {/* DESCRIÇÃO COM O ESTILO "itálico e aspas" DAS FOTOS */}
              <p className="text-gray-500 font-medium italic text-base mb-8">
                "{job.description}"
              </p>

              {/* RODAPÉ DO CARD */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                    {job.author ? job.author[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-base">{job.author}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      {new Date(job.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleWhatsAppClick(job)} 
                  className="bg-[#22C55E] text-white px-7 py-3.5 rounded-[1.2rem] font-black flex items-center gap-2 shadow-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span className="text-sm">Chamar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* NAV INFERIOR ESTILO IPHONE (FLUTUANTE) */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md border border-gray-100 p-4 flex justify-around max-w-2xl mx-auto rounded-[2rem] shadow-2xl z-40">
        <button className="p-2 text-blue-600 transition-transform active:scale-90"><CheckCircle2 className="w-7 h-7" /></button>
        <button className="p-2 text-gray-300 transition-transform active:scale-90"><Search className="w-7 h-7" /></button>
        <button className="p-2 text-gray-200"><div className="w-7 h-7 bg-gray-100 rounded-full border border-gray-200" /></button>
      </nav>

      {/* MODAL DE CADASTRO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] p-10 relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-600">
              <X className="w-8 h-8" />
            </button>
            <h2 className="text-2xl font-black mb-8 text-slate-800 tracking-tight">Novo Bico</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Seu Nome" required className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.author} onChange={e => setNewJob({...newJob, author: e.target.value})} />
                <input type="tel" placeholder="WhatsApp" required className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.whatsapp} onChange={e => setNewJob({...newJob, whatsapp: e.target.value})} />
              </div>
              <input type="text" placeholder="O que você precisa?" required className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              <div className="flex gap-4">
                <select className="w-1/2 bg-gray-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500" value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Bairro" className="w-1/2 bg-gray-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <textarea placeholder="Explique os detalhes do serviço..." className="w-full bg-gray-50 p-4 rounded-2xl h-28 font-bold border-2 border-transparent focus:border-blue-500 outline-none resize-none" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              <button className="w-full bg-[#2563EB] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95">Publicar no Mural</button>
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