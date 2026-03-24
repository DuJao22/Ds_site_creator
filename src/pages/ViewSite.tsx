import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, CheckCircle, Navigation, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function ViewSite() {
  const { slug } = useParams();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch(`/api/sites/${slug}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Site não encontrado');
        
        setSite(data);
        document.title = `${data.name} | Site Oficial`;
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-4xl font-bold">!</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Ops!</h1>
          <p className="text-slate-500 text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (site.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-t-4 border-red-500"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl font-bold">!</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Este site expirou</h1>
          <p className="text-slate-500 mb-8 text-lg">
            O período de demonstração ou contratação deste site chegou ao fim.
          </p>
          <div className="bg-slate-100 py-4 px-6 rounded-2xl">
            <p className="text-sm font-medium text-slate-900">
              Entre em contato com a <strong className="text-blue-600">DS Company</strong> para ativação permanente.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const servicesList = site.services.split(',').map((s: string) => s.trim()).filter(Boolean);
  
  const cleanPhone = site.phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  const whatsappLink = `https://wa.me/${finalPhone}?text=Olá! Vim através do site e gostaria de mais informações.`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden scroll-smooth">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              {site.image_url ? (
                <img src={site.image_url} alt="Logo" className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {site.name.charAt(0)}
                </div>
              )}
              <span className="font-bold text-xl tracking-tight text-slate-900">{site.name}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sobre</a>
              <a href="#servicos" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Serviços</a>
              <a href="#contato" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contato</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar Conosco
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Atendimento Online e Presencial
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
            >
              Soluções de excelência para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">você e sua empresa.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {site.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Orçamento
              </a>
              <a href="#servicos" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Ver Serviços
              </a>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-blue-400/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group"
            >
              <img src={site.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'} alt="Sobre nós" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{site.name}</h3>
                <p className="text-white/80 flex items-center"><MapPin className="w-4 h-4 mr-2" /> {site.city}</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Quem Somos</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Compromisso com a qualidade e resultado.</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Nossa missão é entregar o melhor serviço para nossos clientes, unindo experiência, dedicação e as melhores práticas do mercado. Cada projeto é tratado com exclusividade para garantir a sua total satisfação.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-3xl font-bold text-slate-900 mb-1">100%</p>
                  <p className="text-sm text-slate-500 font-medium">Foco no Cliente</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-3xl font-bold text-slate-900 mb-1">24/7</p>
                  <p className="text-sm text-slate-500 font-medium">Suporte Dedicado</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Nossas Especialidades</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">O que podemos fazer por você</h3>
            <p className="text-lg text-slate-600">Conheça nosso portfólio de serviços desenvolvidos sob medida para atender às suas necessidades.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <CheckCircle className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service}</h4>
                <p className="text-slate-500 leading-relaxed">Solução completa e profissional garantindo os melhores resultados para o seu negócio.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">Fale Conosco</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">Vamos iniciar seu próximo projeto?</h3>
              <p className="text-lg text-slate-400 mb-10">Entre em contato hoje mesmo. Nossa equipe está pronta para entender suas necessidades e apresentar a melhor solução.</p>
              
              <div className="space-y-8">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-blue-500 transition-colors">
                    <Phone className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">WhatsApp / Telefone</p>
                    <p className="text-xl font-medium group-hover:text-blue-400 transition-colors">{site.phone}</p>
                  </div>
                </a>

                <div className="flex items-start">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Endereço</p>
                    <p className="text-xl font-medium leading-snug mb-1">{site.address}</p>
                    <p className="text-slate-400">{site.city}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10">
              <h4 className="text-2xl font-bold mb-6">Envie uma mensagem rápida</h4>
              <form action={whatsappLink} method="get" target="_blank" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Seu Nome</label>
                  <input type="text" placeholder="Como podemos te chamar?" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Como podemos ajudar?</label>
                  <textarea rows={4} placeholder="Descreva brevemente o que você precisa..." className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar via WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight text-white">{site.name}</span>
          </div>
          
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            {site.map_link && (
              <a href={site.map_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Navigation className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
         className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group">
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm font-medium py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Fale conosco!
        </span>
      </a>
    </div>
  );
}
