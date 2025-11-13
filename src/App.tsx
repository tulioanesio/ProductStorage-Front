// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Dashboard from "./pages/dashboard";
import Produto from "./pages/produto";
import Movimentacao from "./pages/movimentacao";
import Relatorio from "./pages/relatorio";
import MainLayout from "./layouts/MainLayout";
import { CategoriaPage } from "./pages/categoria";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produto />} />
          <Route path="/categorias" element={<CategoriaPage />} />
          <Route path="/movimentacoes" element={<Movimentacao />} />
          <Route path="/relatorios" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
