import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Dashboard from "./pages/dashboard";
import Produto from "./pages/produto";
import Relatorio from "./pages/relatorio";
import MainLayout from "./layouts/MainLayout";
import { MovementPage } from "./pages/movimentacao";
import CategoriasPage from "./pages/categoria";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produto />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/movimentacoes" element={<MovementPage />} />
          <Route path="/relatorios" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
