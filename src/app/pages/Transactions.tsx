"use client";

import { useState } from 'react';
import { useApi, apiCall } from '@/hooks/useApi';
import { Transaction, Category, CreateTransaction } from '@/types/types';
import { 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Transactions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, loading, error, refetch } = useApi<Transaction[]>('/api/transactions');
  const { data: categories } = useApi<Category[]>('/api/categories');

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categories?.find(cat => String(cat.id) === String(transaction.category_id))?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando transações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Erro ao carregar transações</p>
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Transações</h1>
          <p className="text-slate-600">Gerencie suas receitas e despesas</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-slate-600">
            {filteredTransactions.length} transação(ões) encontrada(s)
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando sua primeira transação'
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((transaction) => {
              const categoryName = categories?.find(cat => String(cat.id) === String(transaction.category_id))?.name || 'Sem Categoria';
              return (
                <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-slate-900">
                            {transaction.description || categoryName}
                          </h3>
                          <div className="flex items-center space-x-1 text-sm text-slate-500">
                            <Tag className="w-3 h-3" />
                            <span>{transaction.category_id}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(transaction.transaction_date)}</span>
                          {transaction.is_recurring && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                              Recorrente
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          categories={categories || []}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

interface AddTransactionModalProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

function AddTransactionModal({ categories, onClose, onSuccess }: AddTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateTransaction>>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    is_recurring: false,
    transaction_date: new Date().toISOString().split('T')[0],
  });

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    setLoading(true);
    try {
      await apiCall('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Nova Transação</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Receita</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Despesa</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valor (AOA)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoria
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Supermercado, Salário..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data
            </label>
            <input
              type="date"
              required
              value={formData.transaction_date}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
            />
            <label htmlFor="recurring" className="ml-2 text-sm text-slate-700">
              Transação recorrente
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading || !formData.amount || !formData.category}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Adicionar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
