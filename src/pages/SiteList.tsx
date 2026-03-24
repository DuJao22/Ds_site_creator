import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExternalLink, Edit, Trash2, RefreshCw, Copy, Check, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteList() {
  const { token } = useAuth();
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [token]);

  const handleReactivate = async (id: number) => {
    const days = window.prompt('Quantos dias deseja reativar?', '7');
    if (!days) return;

    try {
      await fetch(`/api/sites/${id}/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ duration_days: days })
      });
      fetchSites();
    } catch (error) {
      alert('Erro ao reativar site');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este site?')) return;

    try {
      await fetch(`/api/sites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSites();
    } catch (error) {
      alert('Erro ao excluir site');
    }
  };

  const copyToClipboard = (slug: string, id: number) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadHtml = (slug: string) => {
    window.open(`/api/sites/${slug}/export`, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Meus Sites</h1>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Criar Novo Site
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Expiração</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {sites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500">
                    <p className="mb-4">Nenhum site criado ainda.</p>
                    <Link to="/create" className="text-emerald-600 font-medium hover:underline">Crie seu primeiro site</Link>
                  </td>
                </tr>
              ) : (
                sites.map((site: any) => {
                  const isExpired = new Date(site.expires_at) <= new Date();
                  return (
                    <tr key={site.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900">{site.name}</div>
                        <div className="text-sm text-zinc-500">{site.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <a href={`/s/${site.slug}`} target="_blank" rel="noreferrer" className="text-sm text-emerald-600 hover:underline flex items-center">
                            {site.slug}.dscompany.site <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                          <button onClick={() => copyToClipboard(site.slug, site.id)} className="text-zinc-400 hover:text-zinc-600" title="Copiar Link">
                            {copiedId === site.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isExpired ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isExpired ? 'Expirado' : 'Ativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {new Date(site.expires_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button onClick={() => handleDownloadHtml(site.slug)} className="text-emerald-600 hover:text-emerald-900 flex items-center" title="Baixar HTML">
                            <Download className="w-4 h-4" />
                          </button>
                          {isExpired && (
                            <button onClick={() => handleReactivate(site.id)} className="text-blue-600 hover:text-blue-900 flex items-center" title="Reativar">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(site.id)} className="text-red-600 hover:text-red-900 flex items-center" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
