import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle, MessageCircle, MapPin, Filter, Search,
  CheckCircle2, Clock, X, Briefcase
} from 'lucide-react';

// CREDENCIAIS:
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

  // Importação da fonte Old Standard TT
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
    <div className="min-h-screen bg-[#F8FAFC] pb-24" style={{ fontFamily: "'Old Standard TT', serif" }}>
      
      {/* HEADER: Borda reduzida e fonte aplicada */}
      <header className="bg-[#2563EB] text-white px-6 py-5 rounded-b-xl shadow-lg sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              <h1 className="text-2xl font-bold tracking-tight">Mural SJP</h1>
            </div>
            <p className="text-blue-100 text-[10px] uppercase tracking-widest mt-0.5 opacity-80">São João da Ponta conectado</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white text-[#2563EB] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md hover:bg-blue-50 transition-colors">
            <PlusCircle className="w-4 h-4" /> Postar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto py-6 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              style={{ fontFamily: "'Old Standard TT', serif" }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap border ${filter === cat.id ? 'bg-[#2563EB] text-white border-transparent' : 'bg-white text-gray-500 border-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {loading ? <p className="text-center py-10">Carregando...</p> : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="bg-blue-50 text-[#2563EB] text-[10px] font-bold px-3 py-1 rounded-lg uppercase">{job.category}</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3"/>{job.location}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h3>
              <p className="text-gray-500 italic mb-6">"{job.description}"</p>
              <div className="flex items-center justify-between border-t pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">{job.author[0]}</div>
                  <div>
                    <p className="font-bold text-slate-700">{job.author}</p>
                    <p className="text-xs text-gray-400">{new Date(job.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <button onClick={() => handleWhatsAppClick(job)} className="bg-[#22C55E] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
                  <MessageCircle className="w-5 h-5" /> Chamar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" style={{ fontFamily: "'Old Standard TT', serif" }}>
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] p-10 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6"><X /></button>
            <h2 className="text-2xl font-bold mb-6">Novo Bico</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input type="text" placeholder="Seu Nome" required style={{ fontFamily: "'Old Standard TT', serif" }} className="w-full bg-gray-50 p-4 rounded-2xl" value={newJob.author} onChange={e => setNewJob({...newJob, author: e.target.value})} />
              <input type="tel" placeholder="WhatsApp (919...)" required style={{ fontFamily: "'Old Standard TT', serif" }} className="w-full bg-gray-50 p-4 rounded-2xl" value={newJob.whatsapp} onChange={e => setNewJob({...newJob, whatsapp: e.target.value})} />
              <input type="text" placeholder="Título do serviço" required style={{ fontFamily: "'Old Standard TT', serif" }} className="w-full bg-gray-50 p-4 rounded-2xl" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              <div className="flex gap-4">
                <select style={{ fontFamily: "'Old Standard TT', serif" }} className="w-1/2 bg-gray-50 p-4 rounded-2xl" value={newJob.category} onChange={e => setNewJob({...newJob, category: e.target.value})}>
                  {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Bairro" style={{ fontFamily: "'Old Standard TT', serif" }} className="w-1/2 bg-gray-50 p-4 rounded-2xl" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <textarea placeholder="Descrição" style={{ fontFamily: "'Old Standard TT', serif" }} className="w-full bg-gray-50 p-4 rounded-2xl h-24" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              <button className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold shadow-lg">Publicar</button>
            </form>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around max-w-2xl mx-auto rounded-t-3xl shadow-lg">
        <CheckCircle2 className="text-blue-600" />
        <Search className="text-gray-300" />
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
      </nav>
    </div>
  );
}
