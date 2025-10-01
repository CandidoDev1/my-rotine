"use client";

import { useState } from 'react';
import { useApi, apiCall } from '@/hooks/useApi';
import { SavingsGoal, CreateSavingsGoal } from '@/types/types';
import { 
  Plus, 
  Target, 
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Goals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: goals, loading, error, refetch } = useApi<SavingsGoal[]>('/api/savings-goals');

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

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (targetDate?: string) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando metas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Erro ao carregar metas</p>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Metas de Poupança</h1>
          <p className="text-slate-600">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Goals Grid */}
      {!goals || goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma meta definida</h3>
          <p className="text-slate-600 mb-6">
            Comece criando sua primeira meta de poupança para organizar melhor suas finanças
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysRemaining = goal.target_date ? calculateDaysRemaining(goal.target_date) : null;
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Target className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  
                  {isCompleted && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Concluída
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{goal.name}</h3>
                
                {goal.description && (
                  <p className="text-slate-600 text-sm mb-4">{goal.description}</p>
                )}
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progresso</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isCompleted ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Atual:</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(goal.current_amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Meta:</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Restante:</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
                    </span>
                  </div>
                  
                  {goal.target_date && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <Calendar className="w-3 h-3" />
                        <span>Meta:</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">
                          {formatDate(goal.target_date)}
                        </div>
                        {daysRemaining !== null && (
                          <div className={`text-xs ${
                            daysRemaining < 0 
                              ? 'text-red-600' 
                              : daysRemaining < 30 
                                ? 'text-orange-600' 
                                : 'text-slate-500'
                          }`}>
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} dias atrasado`
                              : daysRemaining === 0
                                ? 'Hoje'
                                : `${daysRemaining} dias restantes`
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <AddGoalModal
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

interface AddGoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddGoalModal({ onClose, onSuccess }: AddGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateSavingsGoal>>({
    name: '',
    target_amount: 0,
    target_date: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) return;

    setLoading(true);
    try {
      await apiCall('/api/savings-goals', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          target_date: formData.target_date || undefined,
          description: formData.description || undefined,
        }),
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Nova Meta de Poupança</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome da Meta *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Viagem para Europa, Carro novo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valor da Meta (AOA) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.target_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, target_amount: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Limite (opcional)
            </label>
            <input
              type="date"
              value={formData.target_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva sua meta..."
              rows={3}
            />
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
              disabled={loading || !formData.name || !formData.target_amount}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Criar Meta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
