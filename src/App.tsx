import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import "./index.css";
import Produto from "./pages/produto";
import Categoria from "./pages/categoria";
import Movimentacao from "./pages/movimentacao";
import Relatorio from "./pages/relatorio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<Produto />} />
        <Route path="/categorias" element={<Categoria />} />
        <Route path="/movimentacoes" element={<Movimentacao />} />
        <Route path="/relatorios" element={<Relatorio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
