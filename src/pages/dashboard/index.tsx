import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Box,
  Tags,
  BarChart3,
  ArrowLeftRight,
  LayoutDashboard,
  RefreshCcw,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalStockValue: number;
}

export default function Home() {
  const [data, setData] = useState<DashboardData>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalStockValue: 0,
  });

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    axios
      .get(`${apiUrl}/dashboard`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dashboard:", err);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
          <div className="p-6 border-b">
            <Link to="/">
              <h1 className="text-xl font-semibold text-blue-600">
                Gestor de Estoque
              </h1>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link to="/">
              <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium transition cursor-pointer">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            </Link>

            <Link to="/produtos">
              <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <Package className="w-5 h-5 text-gray-600" />
                Produtos
              </button>
            </Link>

            <Link to="/categorias">
              <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <Tags className="w-5 h-5 text-gray-600" />
                Categorias
              </button>
            </Link>

            <Link to="/movimentacoes">
              <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <RefreshCcw className="w-5 h-5 text-gray-600" />
                Movimentações
              </button>
            </Link>

            <Link to="/relatorios">
              <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                Relatórios
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-500 mb-6">Visão geral do seu estoque</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <Card>
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total de Produtos</p>
                  <p className="text-2xl font-semibold mt-1">
                    {data.totalProducts}
                  </p>
                </div>
                <Package className="text-blue-600" size={28} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Produtos Abaixo do Mínimo
                  </p>
                  <p className="text-2xl font-semibold mt-1 text-red-500">
                    {data.lowStockProducts}
                  </p>
                </div>
                <AlertTriangle className="text-red-600" size={28} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Valor Total em Estoque
                  </p>
                  <p className="text-2xl font-semibold mt-1 text-green-600">
                    {data.totalStockValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <DollarSign className="text-green-600" size={28} />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-medium mb-3">Atalhos Rápidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/produtos">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader className="pb-2">
                  <Box className="text-blue-600 mb-2" size={28} />
                  <CardTitle className="text-base">Produtos</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  Gerenciar produtos do estoque
                </CardContent>
              </Card>
            </Link>

            <Link to="/categorias">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader className="pb-2">
                  <Tags className="text-purple-600 mb-2" size={28} />
                  <CardTitle className="text-base">Categorias</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  Organizar categorias de produtos
                </CardContent>
              </Card>
            </Link>

            <Link to="/movimentacoes">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader className="pb-2">
                  <ArrowLeftRight className="text-orange-600 mb-2" size={28} />
                  <CardTitle className="text-base">Movimentações</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  Registrar entradas e saídas
                </CardContent>
              </Card>
            </Link>

            <Link to="/relatorios">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader className="pb-2">
                  <BarChart3 className="text-green-600 mb-2" size={28} />
                  <CardTitle className="text-base">Relatórios</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  Visualizar relatórios e gráficos
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </div>

      <footer className="w-full border-t bg-white">
        <div className="mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600"></div>

          <div className="text-sm items-center text-gray-400">
            © 2025 - Gestão de Estoque
          </div>

          <div className="flex items-end gap-4">
            <a
              href="https://github.com/tulioanesio/ProductStorage-Front"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">Frontend</span>
            </a>

            <a
              href="https://github.com/tulioanesio/ProductStorage-Back"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">Backend</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
