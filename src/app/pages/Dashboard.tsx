/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from '@/hooks/useApi';
import { useUserInitialization } from '@/hooks/useUserInitialization';
import { DashboardData } from '@/types/types';
import StatCard from '@/components/StatCard';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function Dashboard() {
  useUserInitialization();
  const { data: dashboardData, loading, error, refetch } = useApi<DashboardData>('/api/dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Erro ao carregar dados</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Chart colors
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Financeiro</h1>
        <p className="text-slate-600">Visão geral das suas finanças este mês</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Receitas"
          value={formatCurrency(dashboardData.totalIncome)}
          icon={TrendingUp}
          color="green"
        />
        
        <StatCard
          title="Despesas"
          value={formatCurrency(dashboardData.totalExpenses)}
          icon={TrendingDown}
          color="red"
        />
        
        <StatCard
          title="Poupança"
          value={formatCurrency(dashboardData.totalSavings)}
          change={formatPercent(dashboardData.monthlyGrowth)}
          changeType={dashboardData.monthlyGrowth >= 0 ? 'positive' : 'negative'}
          icon={PiggyBank}
          color="blue"
        />
        
        <StatCard
          title="Taxa de Poupança"
          value={formatPercent(dashboardData.savingsRate)}
          icon={Wallet}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Despesas por Categoria</h3>
          
          {dashboardData.categoryBreakdown.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }: any) => `${category}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {dashboardData.categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma despesa registrada ainda</p>
              </div>
            </div>
          )}
        </div>

        {/* Income vs Expenses Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Receitas vs Despesas</h3>
          
          {dashboardData.incomeVsExpenses.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.incomeVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-');
                      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                      return `${monthNames[parseInt(month) - 1]} ${year}`;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Receitas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Despesas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum histórico disponível ainda</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Ações Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Adicionar Receita</h4>
                <p className="text-sm text-slate-600">Registrar novo rendimento</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl hover:from-red-100 hover:to-rose-100 transition-all text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Adicionar Despesa</h4>
                <p className="text-sm text-slate-600">Registrar novo gasto</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-sky-100 transition-all text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Nova Meta</h4>
                <p className="text-sm text-slate-600">Definir objetivo de poupança</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
