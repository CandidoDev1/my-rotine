import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Transações", path: "/transacoes" },
    { name: "Metas", path: "/metas" },
    { name: "Configurações", path: "/configuracoes" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white font-bold rounded-md">
              mR
            </div>
            <span className="font-semibold text-lg text-gray-800">
              myRotine
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-transparent hover:border-gray-300 hover:bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Perfil */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-medium">
              P
            </div>
            <span className="text-sm text-gray-600">puftjf@gmail.com</span>
            <button className="ml-2 text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <span>Sair</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {open ? (
                // Ícone X
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Ícone Hamburguer
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-transparent hover:border-gray-300 hover:bg-gray-50"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Perfil no mobile */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-medium">
              P
            </div>
            <span className="text-sm text-gray-600">puftjf@gmail.com</span>
            <button className="ml-auto text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
