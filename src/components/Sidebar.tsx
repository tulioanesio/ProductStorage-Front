import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Tags,
  RefreshCcw,
  BarChart3,
  LayoutDashboard,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();

  const menu = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/produtos", label: "Produtos", icon: <Package className="w-5 h-5" /> },
    { path: "/categorias", label: "Categorias", icon: <Tags className="w-5 h-5" /> },
    { path: "/movimentacoes", label: "Movimentações", icon: <RefreshCcw className="w-5 h-5" /> },
    { path: "/relatorios", label: "Relatórios", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <aside className={cn("w-64 bg-white border-r shadow-sm flex flex-col h-full", className)}>
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-4" onClick={onNavigate}>
          <Boxes size={48} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-blue-600">Gestor de Estoque</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menu.map(({ path, label, icon }) => (
          <Link key={path} to={path} onClick={onNavigate}>
            <button
              className={cn(
                "w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg mb-2 transition cursor-pointer",
                location.pathname === path
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              )}
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