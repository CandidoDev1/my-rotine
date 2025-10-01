/* eslint-disable @next/next/no-img-element */
"use client";

import { NavLink, useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/transactions", icon: CreditCard, label: "Transações" },
    { to: "/goals", icon: Target, label: "Metas" },
    { to: "/settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">mR</span>
                </div>
                <span className="font-bold text-xl text-slate-800">myRotine</span>
              </div>
              
              <div className="flex space-x-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-green-100 text-green-700 font-medium"
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.google_user_data.picture || ""}
                  alt={user?.google_user_data.name || ""}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-800">
                    {user?.google_user_data.name}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">mR</span>
              </div>
              <span className="font-bold text-xl text-slate-800">myRotine</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <img
                    src={user?.google_user_data.picture || ""}
                    alt={user?.google_user_data.name || ""}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {user?.google_user_data.name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all w-full mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
