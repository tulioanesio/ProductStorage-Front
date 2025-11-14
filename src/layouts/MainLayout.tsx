import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
 return (
  <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
   <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto">
     <Outlet />
    </main>
   </div>

   <Footer />

   <Toaster />
  </div>
 );
}
