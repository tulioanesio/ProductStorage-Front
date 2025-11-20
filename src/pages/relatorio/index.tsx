import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  AlertTriangle,
  DollarSign,
  ArrowUpFromLine,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useRelatorios, type ReportType } from "../../hooks/useRelatorios";

export default function Relatorio() {
  const [reportType, setReportType] = useState<ReportType>("PRICE_LIST");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);

  const { data, summary, pageInfo, loading, error } = useRelatorios(
    reportType,
    page,
    pageSize
  );

  const handleReportTypeChange = (value: ReportType) => {
    setReportType(value);
    setPage(0);
  };

  const getColumns = (type: ReportType) => {
    switch (type) {
      case "PRICE_LIST":
        return ["Nome do Produto", "Categoria", "Unidade", "Preço Unitário"];
      case "BALANCE":
        return ["Produto", "Qtd. Estoque", "Valor Total (Item)"];
      case "LOW_STOCK":
        return ["Produto", "Estoque Mínimo", "Estoque Atual", "Situação"];
      case "BY_CATEGORY":
        return ["Categoria", "Quantidade de Produtos"];
      case "MOST_OUTPUT":
        return ["Produto", "Total Saídas"];
      case "MOST_INPUT":
        return ["Produto", "Total Entradas"];
      default:
        return [];
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const renderRow = (item: any, type: ReportType) => {
    switch (type) {
      case "PRICE_LIST":
        return (
          <>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.category?.name || "Sem Categoria"}</TableCell>
            <TableCell>{item.unitOfMeasure}</TableCell>
            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
          </>
        );
      case "BALANCE":
        return (
          <>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.stockAvailable}</TableCell>
            <TableCell className="font-bold text-green-600">
              {formatCurrency(item.totalValue)}
            </TableCell>
          </>
        );
      case "LOW_STOCK":
        return (
          <>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.minStockQuantity}</TableCell>
            <TableCell className="text-red-600 font-bold">
              {item.quantity}
            </TableCell>
            <TableCell>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                Repor Estoque
              </span>
            </TableCell>
          </>
        );
      case "BY_CATEGORY":
        return (
          <>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
          </>
        );
      case "MOST_OUTPUT":
      case "MOST_INPUT":
        return (
          <>
            <TableCell className="font-medium">{item.productName}</TableCell>
            <TableCell className="font-bold">{item.totalQuantity}</TableCell>
          </>
        );
      default:
        return null;
    }
  };

  const reportOptions: {
    value: ReportType;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "PRICE_LIST", label: "Lista de Preços", icon: FileText },
    { value: "BALANCE", label: "Balanço Físico/Financeiro", icon: DollarSign },
    {
      value: "LOW_STOCK",
      label: "Produtos Abaixo do Mínimo",
      icon: AlertTriangle,
    },
    { value: "BY_CATEGORY", label: "Produtos por Categoria", icon: BarChart3 },
    { value: "MOST_OUTPUT", label: "Maior Saída", icon: ArrowUpFromLine },
    { value: "MOST_INPUT", label: "Maior Entrada", icon: ArrowDownToLine },
  ];

  const CurrentIcon =
    reportOptions.find((r) => r.value === reportType)?.icon || FileText;
  const isPaginated = !!pageInfo;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Relatórios</h2>
          <p className="text-gray-500">
            Gere relatórios detalhados sobre seu inventário.
          </p>
        </div>

        <div className="w-full sm:w-[300px]">
          <Select
            value={reportType}
            onValueChange={(v) => handleReportTypeChange(v as ReportType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o relatório" />
            </SelectTrigger>
            <SelectContent>
              {reportOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4 text-muted-foreground" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {reportType === "BALANCE" && summary.totalValue !== undefined && (
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-green-800">
                Valor Total do Estoque
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(summary.totalValue)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Somatório dos totais de cada produto
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <CurrentIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {reportOptions.find((r) => r.value === reportType)?.label}
              </CardTitle>
              <CardDescription>
                {data
                  ? `${
                      pageInfo?.totalElements || data.length
                    } registros encontrados`
                  : "Carregando..."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <span>Carregando dados do relatório...</span>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getColumns(reportType).map((col, index) => (
                        <TableHead
                          key={index}
                          className="font-semibold whitespace-nowrap"
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data && data.length > 0 ? (
                      data.map((item, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          {renderRow(item, reportType)}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={getColumns(reportType).length}
                          className="h-24 text-center text-gray-500"
                        >
                          Nenhum registro encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {isPaginated && pageInfo && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="text-sm text-gray-500 mr-4">
                    Página {pageInfo.number + 1} de {pageInfo.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={pageInfo.first || loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pageInfo.last || loading}
                  >
                    Próxima
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
