import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Tags,
  RefreshCcw,
  BarChart3,
  LayoutDashboard,
  Boxes,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/produtos", label: "Produtos", icon: <Package className="w-5 h-5" /> },
    { path: "/categorias", label: "Categorias", icon: <Tags className="w-5 h-5" /> },
    { path: "/movimentacoes", label: "Movimentações", icon: <RefreshCcw className="w-5 h-5" /> },
    { path: "/relatorios", label: "Relatórios", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-4">
          <Boxes size={48} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-blue-600">Gestor de Estoque</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        {menu.map(({ path, label, icon }) => (
          <Link key={path} to={path}>
            <button
              className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg mb-2 transition cursor-pointer ${location.pathname === path
                ? "bg-blue-50 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {icon}
              {label}
            </button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
