import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  DollarSign,
  ArrowLeftRight,
  Tags,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return <p className="text-gray-500">Carregando informações...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-6">Visão geral do seu estoque</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-semibold mt-1">{data.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Abaixo do Limite</p>
              <p className="text-2xl font-semibold mt-1 text-red-500">
                {data.lowStockProducts}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Acima do Limite</p>
              <p className="text-2xl font-semibold mt-1 text-orange-500">
                {data.highStockProducts}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Valor Total em Estoque</p>
              <p className="text-2xl font-semibold mt-1 text-green-600">
                {data.totalStockValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={28} />
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-medium mb-3">Atalhos Rápidos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{
          to: "/produtos",
          icon: Package,
          iconBg: "bg-blue-100 text-blue-600",
          title: "Produtos",
          description: "Gerencie todos os produtos do estoque"
        }, {
          to: "/categorias",
          icon: Tags,
          iconBg: "bg-purple-100 text-purple-600",
          title: "Categorias",
          description: "Gerencie todas as categorias"
        }, {
          to: "/movimentacoes",
          icon: ArrowLeftRight,
          iconBg: "bg-orange-100 text-orange-600",
          title: "Movimentações",
          description: "Registrar entradas e saídas"
        }, {
          to: "/relatorios",
          icon: BarChart3,
          iconBg: "bg-green-100 text-green-600",
          title: "Relatórios",
          description: "Visualize dados analíticos"
        }].map((card) => (
          <Link key={card.to} to={card.to}>
            <Card className="hover:shadow-md transition cursor-pointer h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className={`w-10 h-10 flex items-center justify-center rounded ${card.iconBg}`}>
                  <card.icon size={20} />
                </div>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
