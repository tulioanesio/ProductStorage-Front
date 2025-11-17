import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Dashboard from "./pages/dashboard";
import Produto from "./pages/produto";
import Relatorio from "./pages/relatorio";
import MainLayout from "./layouts/MainLayout";
import CategoriasPage from "./pages/categoria";
import MovimentacoesPage from "./pages/movimentacao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produto />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="/relatorios" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
