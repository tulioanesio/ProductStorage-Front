import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2 font-semibold text-blue-600">
          Gestor de Estoque
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-left duration-200 z-50">
            <div className="absolute right-2 top-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <div className="hidden md:flex">
          <Sidebar className="h-full" />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden w-full">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}
