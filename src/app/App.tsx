"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/app/pages/Home";
import DashboardPage from "@/app/pages/Dashboard";
import TransactionsPage from "@/app/pages/Transactions";
import GoalsPage from "@/app/pages/Goals";
import SettingsPage from "@/app/pages/Settings";
import AuthCallbackPage from "@/app/pages/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navegation";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <GoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
