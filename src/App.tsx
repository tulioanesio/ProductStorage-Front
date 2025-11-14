import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Dashboard from "./pages/dashboard";
import Produto from "./pages/produto";
import Relatorio from "./pages/relatorio";
import MainLayout from "./layouts/MainLayout";
import { CategoriaPage } from "./pages/categoria";
import { MovementPage } from "./pages/movimentacao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produto />} />
          <Route path="/categorias" element={<CategoriaPage />} />
          <Route path="/movimentacoes" element={<MovementPage />} />
          <Route path="/relatorios" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
