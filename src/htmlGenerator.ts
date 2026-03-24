export function generateSiteHtml(site: any): string {
  const servicesList = site.services.split(',').map((s: string) => s.trim()).filter(Boolean);
  const cleanPhone = site.phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  const whatsappLink = `https://wa.me/${finalPhone}?text=Olá! Vim através do site e gostaria de mais informações.`;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.name} | Site Oficial</title>
    <meta name="description" content="${site.description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
              brand: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' }
            }
          }
        }
      }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .hero-pattern {
            background-color: #ffffff;
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .glass-nav {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        
        /* Mobile menu transition */
        #mobile-menu {
            transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
        }
        #mobile-menu.open {
            max-height: 300px;
            opacity: 1;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-brand-200 selection:text-brand-900">

    <!-- Navbar -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center gap-3">
                    ${site.image_url ? `<img src="${site.image_url}" alt="Logo" class="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm">` : `<div class="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xl">${site.name.charAt(0)}</div>`}
                    <span class="font-bold text-xl tracking-tight text-slate-900 truncate max-w-[200px] sm:max-w-xs">${site.name}</span>
                </div>
                
                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#sobre" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Sobre</a>
                    <a href="#servicos" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Serviços</a>
                    <a href="#depoimentos" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Depoimentos</a>
                    <a href="#contato" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Contato</a>
                    <a href="${whatsappLink}" target="_blank" class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                        <i data-lucide="message-circle" class="w-4 h-4 mr-2"></i>
                        Falar Conosco
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-slate-600 hover:text-brand-600 focus:outline-none p-2">
                        <i data-lucide="menu" class="w-6 h-6" id="menu-icon"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full left-0">
            <div class="px-4 pt-2 pb-6 space-y-2 flex flex-col">
                <a href="#sobre" class="mobile-link block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50">Sobre</a>
                <a href="#servicos" class="mobile-link block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50">Serviços</a>
                <a href="#depoimentos" class="mobile-link block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50">Depoimentos</a>
                <a href="#contato" class="mobile-link block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50">Contato</a>
                <a href="${whatsappLink}" target="_blank" class="mt-4 w-full inline-flex items-center justify-center px-5 py-3 text-base font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-md">
                    <i data-lucide="message-circle" class="w-5 h-5 mr-2"></i>
                    Falar Conosco
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-pattern">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center max-w-4xl mx-auto">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-medium mb-8 fade-in-up">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    Atendimento Especializado
                </div>
                
                <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 sm:mb-8 fade-in-up delay-100 leading-[1.1]">
                    Soluções de excelência para <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-400">você e sua empresa.</span>
                </h1>
                
                <p class="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed fade-in-up delay-200 px-4 sm:px-0">
                    ${site.description}
                </p>
                
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4 fade-in-up delay-300 w-full px-4 sm:px-0">
                    <a href="${whatsappLink}" target="_blank" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-1">
                        <i data-lucide="message-circle" class="w-5 h-5 mr-2"></i>
                        Solicitar Orçamento
                    </a>
                    <a href="#servicos" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        Ver Serviços
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Decorative blobs -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand-400/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>
    </section>

    <!-- About Section -->
    <section id="sobre" class="py-16 sm:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
                <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group order-2 lg:order-1">
                    <img src="${site.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'}" alt="Sobre nós" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white">
                        <h3 class="text-xl sm:text-2xl font-bold mb-2">${site.name}</h3>
                        <p class="text-white/80 flex items-center text-sm sm:text-base"><i data-lucide="map-pin" class="w-4 h-4 mr-2"></i> ${site.city}</p>
                    </div>
                </div>
                
                <div class="order-1 lg:order-2">
                    <h2 class="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-3">Quem Somos</h2>
                    <h3 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Compromisso com a qualidade e resultado.</h3>
                    <p class="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
                        Nossa missão é entregar o melhor serviço para nossos clientes, unindo experiência, dedicação e as melhores práticas do mercado. Cada projeto é tratado com exclusividade para garantir a sua total satisfação.
                    </p>
                    
                    <div class="grid grid-cols-2 gap-4 sm:gap-6">
                        <div class="border-l-4 border-brand-500 pl-4 bg-slate-50 p-3 rounded-r-lg">
                            <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">100%</p>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium">Foco no Cliente</p>
                        </div>
                        <div class="border-l-4 border-brand-500 pl-4 bg-slate-50 p-3 rounded-r-lg">
                            <p class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">24/7</p>
                            <p class="text-xs sm:text-sm text-slate-500 font-medium">Suporte Dedicado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="servicos" class="py-16 sm:py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <h2 class="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-3">Nossas Especialidades</h2>
                <h3 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">O que podemos fazer por você</h3>
                <p class="text-base sm:text-lg text-slate-600">Conheça nosso portfólio de serviços desenvolvidos sob medida para atender às suas necessidades.</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                ${servicesList.map((service, i) => `
                <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-brand-600 transition-colors duration-300">
                        <i data-lucide="check-circle" class="w-6 h-6 sm:w-7 sm:h-7 text-brand-600 group-hover:text-white transition-colors duration-300"></i>
                    </div>
                    <h4 class="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">${service}</h4>
                    <p class="text-sm sm:text-base text-slate-500 leading-relaxed">Solução completa e profissional garantindo os melhores resultados para o seu negócio.</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Testimonials / Social Proof -->
    <section id="depoimentos" class="py-16 sm:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <h2 class="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-3">Depoimentos</h2>
                <h3 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">O que dizem nossos clientes</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                    <i data-lucide="quote" class="absolute top-6 right-6 w-8 h-8 text-brand-200"></i>
                    <div class="flex items-center gap-1 mb-4 text-amber-400">
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                    </div>
                    <p class="text-slate-700 mb-6 italic">"Excelente atendimento e serviço de primeira. Recomendo de olhos fechados para todos que buscam qualidade."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">C</div>
                        <div>
                            <p class="font-bold text-slate-900 text-sm">Cliente Satisfeito</p>
                            <p class="text-xs text-slate-500">Avaliação verificada</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                    <i data-lucide="quote" class="absolute top-6 right-6 w-8 h-8 text-brand-200"></i>
                    <div class="flex items-center gap-1 mb-4 text-amber-400">
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                    </div>
                    <p class="text-slate-700 mb-6 italic">"Profissionais extremamente capacitados. Entregaram exatamente o que prometeram, no prazo combinado."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">M</div>
                        <div>
                            <p class="font-bold text-slate-900 text-sm">Maria Silva</p>
                            <p class="text-xs text-slate-500">Avaliação verificada</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                    <i data-lucide="quote" class="absolute top-6 right-6 w-8 h-8 text-brand-200"></i>
                    <div class="flex items-center gap-1 mb-4 text-amber-400">
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                    </div>
                    <p class="text-slate-700 mb-6 italic">"O melhor custo-benefício da região. Superou todas as minhas expectativas. Com certeza voltarei a fazer negócios."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">J</div>
                        <div>
                            <p class="font-bold text-slate-900 text-sm">João Pedro</p>
                            <p class="text-xs text-slate-500">Avaliação verificada</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contato" class="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-500 rounded-full blur-[100px] opacity-30"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
                <div>
                    <h2 class="text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Fale Conosco</h2>
                    <h3 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Vamos iniciar seu próximo projeto?</h3>
                    <p class="text-base sm:text-lg text-slate-400 mb-10">Entre em contato hoje mesmo. Nossa equipe está pronta para entender suas necessidades e apresentar a melhor solução.</p>
                    
                    <div class="space-y-6 sm:space-y-8">
                        <a href="${whatsappLink}" target="_blank" class="flex items-center group bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-brand-500/20 rounded-xl flex items-center justify-center mr-4 sm:mr-6 group-hover:bg-brand-500 transition-colors">
                                <i data-lucide="phone" class="w-5 h-5 sm:w-6 sm:h-6 text-brand-400 group-hover:text-white transition-colors"></i>
                            </div>
                            <div>
                                <p class="text-xs sm:text-sm text-slate-400 mb-1">WhatsApp / Telefone</p>
                                <p class="text-lg sm:text-xl font-medium group-hover:text-brand-400 transition-colors">${site.phone}</p>
                            </div>
                        </a>

                        <div class="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-brand-500/20 rounded-xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0">
                                <i data-lucide="map-pin" class="w-5 h-5 sm:w-6 sm:h-6 text-brand-400"></i>
                            </div>
                            <div>
                                <p class="text-xs sm:text-sm text-slate-400 mb-1">Endereço</p>
                                <p class="text-base sm:text-lg font-medium leading-snug mb-1">${site.address}</p>
                                <p class="text-sm text-slate-400">${site.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10">
                    <h4 class="text-xl sm:text-2xl font-bold mb-6">Envie uma mensagem rápida</h4>
                    <form action="${whatsappLink}" method="get" target="_blank" class="space-y-4 sm:space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Seu Nome</label>
                            <input type="text" placeholder="Como podemos te chamar?" class="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition-all text-sm sm:text-base">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Como podemos ajudar?</label>
                            <textarea rows="4" placeholder="Descreva brevemente o que você precisa..." class="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition-all text-sm sm:text-base"></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 sm:py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center text-sm sm:text-base">
                            <i data-lucide="send" class="w-4 h-4 sm:w-5 sm:h-5 mr-2"></i>
                            Enviar via WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-950 py-8 sm:py-12 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-3">
                <span class="font-bold text-xl tracking-tight text-white">${site.name}</span>
            </div>
            
            <p class="text-slate-500 text-xs sm:text-sm text-center md:text-left">
                © ${new Date().getFullYear()} ${site.name}. Todos os direitos reservados.
            </p>
            
            <div class="flex items-center gap-4">
                <a href="${whatsappLink}" target="_blank" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-colors">
                    <i data-lucide="message-circle" class="w-5 h-5"></i>
                </a>
                ${site.map_link ? `
                <a href="${site.map_link}" target="_blank" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-colors">
                    <i data-lucide="map-pin" class="w-5 h-5"></i>
                </a>
                ` : ''}
            </div>
        </div>
    </footer>

    <!-- Floating WhatsApp Button -->
    <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" 
       class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group">
        <i data-lucide="message-circle" class="w-7 h-7 sm:w-8 sm:h-8"></i>
        <span class="absolute right-full mr-4 bg-slate-900 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
            Fale conosco!
        </span>
    </a>

    <script>
      // Initialize Lucide icons
      lucide.createIcons();

      // Navbar scroll effect
      window.addEventListener('scroll', () => {
          const nav = document.getElementById('navbar');
          if (window.scrollY > 20) {
              nav.classList.add('shadow-md');
          } else {
              nav.classList.remove('shadow-md');
          }
      });

      // Mobile menu toggle
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      const mobileLinks = document.querySelectorAll('.mobile-link');

      let isMenuOpen = false;

      function toggleMenu() {
          isMenuOpen = !isMenuOpen;
          if (isMenuOpen) {
              mobileMenu.classList.add('open');
              menuIcon.setAttribute('data-lucide', 'x');
          } else {
              mobileMenu.classList.remove('open');
              menuIcon.setAttribute('data-lucide', 'menu');
          }
          lucide.createIcons();
      }

      mobileMenuBtn.addEventListener('click', toggleMenu);

      // Close menu when clicking a link
      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (isMenuOpen) toggleMenu();
          });
      });
    </script>
</body>
</html>`;
}
