import React, { useState, useEffect } from 'react';
// Usando importação direta via CDN para garantir compatibilidade no ambiente de desenvolvimento
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import { 
  PlusCircle, 
  MessageCircle, 
  MapPin, 
  Filter, 
  Search,
  CheckCircle2,
  Clock,
  X,
  Briefcase
} from 'lucide-react';

// Configuração do Supabase (Substitua pelas suas chaves do projeto Supabase)
const supabaseUrl = 'SUA_URL_DO_SUPABASE';
const supabaseKey = 'SUA_KEY_DO_SUPABASE';
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
  
  // Estado para o formulário de novo bico
  const [newJob, setNewJob] = useState({
    title: '',
    category: 'Limpeza',
    location: '',
    description: '',
    author: '',
    whatsapp: ''
  });

  // Função para buscar dados do Supabase
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Nota: Em um ambiente real, buscaríamos da tabela 'jobs'
      // const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      
      // Simulando dados para o desenvolvimento inicial
      const mockData = [
        {
          id: 1,
          category: 'LIMPEZA',
          title: 'Preciso de uma diarista',
          description: 'Limpar vitrôs, armários e lavar os banheiros. Casa de 4 compartimentos.',
          author: 'Meire',
          date: '09/02/2026',
          location: 'São João da Ponta',
          whatsapp: '5591999999999'
        },
        {
          id: 2,
          category: 'TECNOLOGIA',
          title: 'Preciso de aulas de informática básica',
          description: 'Preciso de aulas para participar de uma entrevista de emprego.',
          author: 'Eliane',
          date: '09/02/2026',
          location: 'São João da Ponta',
          whatsapp: '5591988888888'
        }
      ];
      setJobs(mockData);
    } catch (error) {
      console.error('Erro ao carregar bicos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleWhatsAppClick = (job) => {
    const cleanPhone = job.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${job.author}, vi seu anúncio "${job.title}" no Mural SJP e gostaria de ajudar!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    
    // Aqui você integraria com o Supabase:
    // const { data, error } = await supabase.from('jobs').insert([ { ...newJob, category: newJob.category.toUpperCase() } ]);
    
    // Atualização local para teste
    const jobToAdd = {
      ...newJob,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      category: newJob.category.toUpperCase()
    };
    
    setJobs([jobToAdd, ...jobs]);
    setShowModal(false);
    setNewJob({ title: '', category: 'Limpeza', location: '', description: '', author: '', whatsapp: '' });
  };

  const filteredJobs = filter === 'todos' 
    ? jobs 
    : jobs.filter(j => j.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24">
      {/* Header Estilizado conforme a imagem */}
      <header className="bg-[#2563EB] text-white px-6 py-10 rounded-b-[3rem] shadow-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
                <Briefcase className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Mural SJP</h1>
            </div>
            <p className="text-blue-100 text-sm mt-2 font-medium opacity-90">São João da Ponta conectado</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white text-[#2563EB] px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Postar Bico
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Filtros de Categoria */}
        <div className="flex gap-3 overflow-x-auto py-8 no-scrollbar">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-w-[50px]">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-7 py-3 rounded-full font-bold whitespace-nowrap transition-all shadow-sm border ${
                filter === cat.id 
                ? 'bg-[#2563EB] text-white border-transparent ring-4 ring-blue-100' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Feed de Bicos */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="font-bold">Buscando oportunidades...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-blue-50 text-[#2563EB] text-[11px] font-black tracking-widest px-4 py-2 rounded-xl uppercase">
                    {job.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {job.location}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                
                <p className="text-gray-500 text-base leading-relaxed mb-8 italic font-medium">
                  "{job.description}"
                </p>

                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-inner">
                      {job.author ? job.author.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-700 leading-none mb-1.5">{job.author}</p>
                      <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {job.date}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleWhatsAppClick(job)}
                    className="bg-[#22C55E] text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-lg hover:bg-green-600 hover:scale-105 transition-all active:scale-95 shadow-green-100"
                  >
                    <MessageCircle className="w-6 h-6 fill-current" />
                    Chamar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-600">Nada por aqui ainda</h3>
              <p className="text-gray-400 font-medium mt-2">Seja o primeiro a postar um bico!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Cadastro (Slide Up) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-10 animate-in slide-in-from-bottom duration-500 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-600 transition-colors">
              <X className="w-8 h-8" />
            </button>
            
            <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Postar Novo Bico</h2>
            
            <form className="space-y-6" onSubmit={handleCreateJob}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                  <input type="text" required value={newJob.author} onChange={(e) => setNewJob({...newJob, author: e.target.value})} placeholder="Ex: Maria Souza" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input type="tel" required value={newJob.whatsapp} onChange={(e) => setNewJob({...newJob, whatsapp: e.target.value})} placeholder="91 9..." className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">O que você precisa?</label>
                <input type="text" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Ex: Preciso de carpinteiro" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                  <select value={newJob.category} onChange={(e) => setNewJob({...newJob, category: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer">
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Local</label>
                  <input type="text" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Ex: Centro" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                <textarea rows="3" required value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Conte detalhes do serviço..." className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#2563EB] text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all active:scale-95 mt-4">
                Publicar no Mural
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navegação de App (Bottom Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-10 py-5 flex justify-around items-center z-40 max-w-2xl mx-auto rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-blue-600 gap-1.5 transition-transform active:scale-90">
          <CheckCircle2 className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
        </button>
        <button className="flex flex-col items-center text-gray-300 gap-1.5 transition-transform active:scale-90">
          <Search className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Buscar</span>
        </button>
        <button className="flex flex-col items-center text-gray-300 gap-1.5 transition-transform active:scale-90">
          <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
          <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
        </button>
      </nav>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-in-bottom { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: slide-in-bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}