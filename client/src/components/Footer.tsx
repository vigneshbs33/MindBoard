import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 mb-4">© 2023 MindBoard - The AI-Powered Creativity Battle Arena</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-500 hover:text-primary transition">
            <Twitter size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary transition">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary transition">
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
