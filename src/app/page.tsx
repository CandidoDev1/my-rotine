"use client"
import { useEffect, useState } from "react";


function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {

    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tempo de carregamento (ex: 1s)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8"> ao My-Rotine</h1>
      </div>
    </main>

  );
}