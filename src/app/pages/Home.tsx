"use client";

import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { 
  TrendingUp, 
  Target, 
  PiggyBank, 
  BarChart3, 
  Shield, 
  Smartphone 
} from "lucide-react";

export default function Home() {
  const { user, redirectToLogin, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-green-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Controle Inteligente",
      description: "Acompanhe suas receitas, despesas e poupança com gráficos visuais e insights automáticos."
    },
    {
      icon: Target,
      title: "Metas de Poupança",
      description: "Defina objetivos financeiros e veja seu progresso com projeções realistas."
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Análises mensais do seu desempenho financeiro com sugestões de otimização."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados financeiros protegidos com autenticação segura e criptografia."
    },
    {
      icon: Smartphone,
      title: "Interface Moderna",
      description: "Design intuitivo e responsivo para uso em qualquer dispositivo."
    },
    {
      icon: PiggyBank,
      title: "Planejamento 50/30/20",
      description: "Sugestões automáticas de alocação baseadas nas melhores práticas financeiras."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">mR</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                myRotine
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-green-100 mb-4 max-w-3xl mx-auto">
              Gestão financeira pessoal inteligente
            </p>
            
            <p className="text-lg text-green-200 mb-12 max-w-2xl mx-auto">
              Controle suas finanças, atinja suas metas e construa um futuro próspero com nossa plataforma completa de gestão financeira.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={redirectToLogin}
                className="bg-white text-green-700 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Começar Agora - É Grátis
              </button>
              
              <button className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                Ver Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tudo que você precisa para controlar suas finanças
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ferramentas profissionais de gestão financeira na palma da sua mão
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl lg:text-5xl font-bold text-green-400 mb-4">
                50/30/20
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Regra de Ouro
              </h3>
              <p className="text-slate-300">
                Alocação inteligente automática baseada nas melhores práticas financeiras
              </p>
            </div>
            
            <div className="p-8">
              <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mb-4">
                100%
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Seguro
              </h3>
              <p className="text-slate-300">
                Dados protegidos com criptografia e autenticação Google
              </p>
            </div>
            
            <div className="p-8">
              <div className="text-4xl lg:text-5xl font-bold text-teal-400 mb-4">
                24/7
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Disponível
              </h3>
              <p className="text-slate-300">
                Acesse suas finanças a qualquer hora, em qualquer lugar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Pronto para transformar suas finanças?
          </h2>
          
          <p className="text-xl text-slate-600 mb-12">
            Junte-se a milhares de pessoas que já estão no controle total de suas finanças
          </p>
          
          <button
            onClick={redirectToLogin}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-12 py-5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl text-lg"
          >
            Criar Conta Gratuita
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">mR</span>
            </div>
            <span className="text-2xl font-bold">myRotine</span>
          </div>
          
          <p className="text-slate-400">
            © 2024 myRotine. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
