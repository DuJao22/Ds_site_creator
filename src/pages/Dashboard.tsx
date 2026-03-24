import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Globe, CheckCircle2, XCircle, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, today: 0 });
  const [recentSites, setRecentSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, sitesRes] = await Promise.all([
          fetch('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/sites', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const statsData = await statsRes.json();
        const sitesData = await sitesRes.json();
        
        setStats(statsData);
        setRecentSites(sitesData.slice(0, 5)); // Get top 5
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  const statCards = [
    { name: 'Total de Sites', value: stats.total, icon: Globe, color: 'bg-blue-500' },
    { name: 'Sites Ativos', value: stats.active, icon: CheckCircle2, color: 'bg-emerald-500' },
    { name: 'Sites Expirados', value: stats.expired, icon: XCircle, color: 'bg-red-500' },
    { name: 'Criados Hoje', value: stats.today, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Criar Novo Site
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${item.color} rounded-md p-3`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-zinc-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-zinc-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-zinc-200">
          <h3 className="text-lg leading-6 font-medium text-zinc-900">Últimos Sites Criados</h3>
          <Link to="/sites" className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center">
            Ver todos <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Expiração</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {recentSites.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-zinc-500">Nenhum site criado ainda.</td>
                </tr>
              ) : (
                recentSites.map((site: any) => {
                  const isExpired = new Date(site.expires_at) <= new Date();
                  return (
                    <tr key={site.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{site.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        <a href={`/s/${site.slug}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                          {site.slug}.dscompany.site
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isExpired ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isExpired ? 'Expirado' : 'Ativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {new Date(site.expires_at).toLocaleDateString('pt-BR')}
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
