import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'green' | 'blue' | 'red' | 'purple';
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color 
}: StatCardProps) {
  const colorClasses = {
    green: {
      bg: 'from-green-500 to-emerald-600',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
    },
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
    },
  };

  const changeColorClasses = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].bg} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${changeColorClasses[changeType]}`}>
            {changeType === 'positive' && '+'}
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
