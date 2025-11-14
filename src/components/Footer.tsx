import { Github } from "lucide-react";

export default function Footer() {
 return (
  <footer className="w-full border-t bg-white">
   <div className="mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
    <div className="text-sm text-gray-400">© 2025 - Gestão de Estoque</div>

    <div className="flex items-end gap-4">
     <a
      href="https://github.com/tulioanesio/ProductStorage-Front"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-slate-600 hover:underline"
     >
      <Github className="w-4 h-4" />
      <span className="text-sm">Frontend</span>
     </a>
     <a
      href="https://github.com/tulioanesio/ProductStorage-Back"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-slate-600 hover:underline"
     >
      <Github className="w-4 h-4" />
      <span className="text-sm">Backend</span>
     </a>
    </div>
   </div>
  </footer>
 );
}
