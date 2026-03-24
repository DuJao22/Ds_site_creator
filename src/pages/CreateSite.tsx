import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Phone, Info, ListChecks, Link as LinkIcon, Image as ImageIcon, Clock, Sparkles, CheckCircle, Download, ExternalLink } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

export default function CreateSite() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [successData, setSuccessData] = useState<{slug: string, id: number} | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    description: '',
    services: '',
    map_link: '',
    image_url: '',
    duration_days: '7'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = async () => {
    if (!mapsLink) {
      setError('Por favor, insira um link do Google Maps.');
      return;
    }
    setIsGeneratingAI(true);
    setError('');

    try {
      // 1. Expand the URL if it's a short link
      let finalUrl = mapsLink;
      let placeNameHint = '';
      try {
        const expandRes = await fetch('/api/expand-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ url: mapsLink })
        });
        
        if (expandRes.ok) {
          const expandData = await expandRes.json();
          if (expandData.url) {
            finalUrl = expandData.url;
            
            // Try to extract place name from the expanded URL
            // e.g., https://www.google.com/maps/place/Nome+do+Lugar/...
            const match = finalUrl.match(/\/place\/([^\/]+)/);
            if (match && match[1]) {
              placeNameHint = decodeURIComponent(match[1].replace(/\+/g, ' '));
            }
          }
        }
      } catch (e) {
        console.warn('Failed to expand URL, using original', e);
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Você é um especialista em marketing e criação de sites.
Você recebeu o seguinte link do Google Maps: ${finalUrl}
${placeNameHint ? `\nDica: O nome do estabelecimento extraído da URL parece ser "${placeNameHint}".` : ''}

Sua missão é OBRIGATÓRIA:
1. USE A FERRAMENTA DE BUSCA DO GOOGLE (Google Search) para pesquisar este link ou o nome do estabelecimento que aparece na URL.
2. Descubra EXATAMENTE qual é o estabelecimento real (nome, nicho, endereço, telefone).
3. Se o link for genérico, quebrado, ou se você NÃO TIVER 100% DE CERTEZA de qual é o estabelecimento exato, você DEVE definir "success" como false e preencher o "errorMessage" explicando que não foi possível identificar o local e pedindo para o usuário verificar o link.
4. Se você encontrou o estabelecimento com sucesso, defina "success" como true e extraia os dados reais: Nome da empresa, telefone (apenas números com DDD), endereço completo e cidade.
5. Identifique o NICHO exato (ex: barbearia, lanchonete, clínica, restaurante).
6. Crie uma DESCRIÇÃO PERSUASIVA E PROFISSIONAL para uma Landing Page de alta conversão, totalmente adaptada ao nicho identificado.
7. Liste os principais serviços oferecidos (ou que fazem sentido para o nicho), separados por vírgula.

NÃO INVENTE DADOS. Se não souber ou não encontrar o local exato, retorne success: false.`,
        config: {
          tools: [{ googleSearch: {} }, { urlContext: {} }],
          toolConfig: { includeServerSideToolInvocations: true },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN, description: "True se encontrou o estabelecimento exato, False se não conseguiu ou se o link for inválido" },
              errorMessage: { type: Type.STRING, description: "Mensagem de erro amigável se success for false" },
              name: { type: Type.STRING, description: "Nome da empresa" },
              phone: { type: Type.STRING, description: "Telefone com DDD, apenas números" },
              address: { type: Type.STRING, description: "Endereço completo" },
              city: { type: Type.STRING, description: "Cidade e Estado" },
              description: { type: Type.STRING, description: "Descrição persuasiva para landing page" },
              services: { type: Type.STRING, description: "Lista de serviços separados por vírgula" },
            },
            required: ["success"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        
        if (!data.success) {
          setError(data.errorMessage || 'Não foi possível identificar o estabelecimento a partir deste link. Por favor, verifique o link ou preencha os dados manualmente.');
          return;
        }

        setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          phone: data.phone || prev.phone,
          address: data.address || prev.address,
          city: data.city || prev.city,
          description: data.description || prev.description,
          services: data.services || prev.services,
          map_link: mapsLink
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError('Erro ao analisar o link com IA. Verifique se o link é válido ou tente novamente.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar site');

      setSuccessData({ slug: data.slug, id: data.id });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadHtml = () => {
    if (successData) {
      window.open(`/api/sites/${successData.slug}/export`, '_blank');
    }
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-zinc-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Site Criado com Sucesso!</h2>
          <p className="text-lg text-zinc-600 mb-8">
            A landing page para <strong>{formData.name}</strong> foi gerada e já está disponível.
          </p>
          
          <div className="bg-zinc-50 rounded-xl p-6 mb-8 border border-zinc-200">
            <p className="text-sm text-zinc-500 mb-2">Link do seu site:</p>
            <a 
              href={`/s/${successData.slug}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-xl font-medium text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2"
            >
              {window.location.origin}/s/{successData.slug}
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownloadHtml}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Código HTML
            </button>
            <button
              onClick={() => navigate('/sites')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-zinc-300 text-base font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Ir para Meus Sites
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-zinc-900 sm:text-3xl sm:truncate">
            Criar Novo Site
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Preencha os dados abaixo para gerar uma landing page instantânea.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Sparkles className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-emerald-900">Auto-preencher com Inteligência Artificial</h3>
            <p className="mt-1 text-sm text-emerald-700">
              Cole o link do Google Maps da empresa. Nossa IA vai buscar os dados e criar uma copy (texto de vendas) otimizada para a landing page.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block sm:text-sm border-emerald-300 rounded-md shadow-sm px-3 py-2 border"
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Dados
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-zinc-200 bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">Informações da Empresa</h3>
            <p className="mt-1 text-sm text-zinc-500">Dados principais que aparecerão em destaque no site.</p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Nome da Empresa</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <Building2 className="h-4 w-4" />
                </span>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">WhatsApp (com DDD)</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <Phone className="h-4 w-4" />
                </span>
                <input type="text" name="phone" id="phone" required value={formData.phone} onChange={handleChange} placeholder="Ex: 11999999999"
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-zinc-700">Cidade / Estado</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <MapPin className="h-4 w-4" />
                </span>
                <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange}
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-700">Endereço Completo</label>
              <div className="mt-1">
                <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange}
                  className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-zinc-300 rounded-md" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700">Descrição do Negócio</label>
              <div className="mt-1">
                <textarea id="description" name="description" rows={3} required value={formData.description} onChange={handleChange}
                  className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border border-zinc-300 rounded-md" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="services" className="block text-sm font-medium text-zinc-700">Serviços (separados por vírgula)</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <ListChecks className="h-4 w-4" />
                </span>
                <input type="text" name="services" id="services" required value={formData.services} onChange={handleChange} placeholder="Ex: Consultoria, Vendas, Suporte"
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="map_link" className="block text-sm font-medium text-zinc-700">Link do Google Maps</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input type="url" name="map_link" id="map_link" required value={formData.map_link} onChange={handleChange} placeholder="https://maps.google.com/..."
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="image_url" className="block text-sm font-medium text-zinc-700">URL da Imagem / Logo</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <ImageIcon className="h-4 w-4" />
                </span>
                <input type="url" name="image_url" id="image_url" required value={formData.image_url} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">Configuração de Tempo</h3>
            <p className="mt-1 text-sm text-zinc-500">Defina por quanto tempo este site ficará ativo.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="duration_days" className="block text-sm font-medium text-zinc-700">Duração (Dias)</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-zinc-500 sm:text-sm">
                  <Clock className="h-4 w-4" />
                </span>
                <select
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  className="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-zinc-300"
                >
                  <option value="1">1 dia</option>
                  <option value="2">2 dias</option>
                  <option value="3">3 dias</option>
                  <option value="7">7 dias</option>
                  <option value="15">15 dias</option>
                  <option value="30">30 dias</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/sites')}
              className="bg-white py-2 px-4 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isLoading ? 'Gerando Site...' : 'Criar Site'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
