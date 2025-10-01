/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useApi, apiCall } from '@/hooks/useApi';
import { UserPreferences, UpdateUserPreferences } from '@/types/types';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { data: preferences, loading, error, refetch } = useApi<UserPreferences>('/api/users/preferences');
  
  const [formData, setFormData] = useState<UpdateUserPreferences>({
    monthly_income: 0,
    currency: 'AOA',
    savings_rate: 0.2,
  });
  
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData({
        monthly_income: preferences.monthly_income,
        currency: preferences.currency,
        savings_rate: preferences.savings_rate,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall('/api/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refetch();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Erro ao carregar configurações</p>
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Configurações</h1>
        <p className="text-slate-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg font-medium">
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-600 hover:bg-slate-50 rounded-lg">
                <SettingsIcon className="w-5 h-5" />
                <span>Preferências</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-600 hover:bg-slate-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span>Notificações</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-600 hover:bg-slate-50 rounded-lg">
                <Shield className="w-5 h-5" />
                <span>Segurança</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Informações do Perfil</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={user?.google_user_data.picture || ''}
                alt={user?.google_user_data.name || ''}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              
              <div>
                <h3 className="text-lg font-medium text-slate-900">
                  {user?.google_user_data.name}
                </h3>
                <p className="text-slate-600">{user?.email}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-AO')}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700">Email verificado</p>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Verificado</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700">Último acesso</p>
                <p className="text-sm text-slate-600 mt-1">
                  {new Date(user?.last_signed_in_at || '').toLocaleDateString('pt-AO')}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Preferências Financeiras</h2>
              {showSuccess && (
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvo com sucesso!</span>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Renda Mensal (AOA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthly_income || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    monthly_income: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 150000"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Usado para calcular suas metas e sugestões de poupança
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Moeda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AOA">Kwanza Angolano (AOA)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta de Poupança Mensal
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.savings_rate}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      savings_rate: parseFloat(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>0%</span>
                    <span className="font-medium text-blue-600">
                      {((formData.savings_rate || 0) * 100).toFixed(0)}%
                    </span>
                    <span>100%</span>
                  </div>
                  
                  {formData.monthly_income && formData.savings_rate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Meta mensal: </span>
                        {formatCurrency((formData.monthly_income || 0) * (formData.savings_rate || 0))}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Alocação de Orçamento</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Regra 50/30/20 (Recomendada)</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Necessidades (Moradia, Alimentação, Transporte)</span>
                    <span className="font-medium">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desejos (Lazer, Entretenimento, Compras)</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poupança e Investimentos</span>
                    <span className="font-medium">20%</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600">
                Esta é uma sugestão baseada em boas práticas financeiras. Ajuste conforme sua realidade pessoal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
