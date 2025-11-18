import { Shield } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg text-gray-900">SafeLinkEdu</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#dashboard" className="text-gray-700 hover:text-blue-600 transition-colors hidden sm:block">
              Dashboard
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors hidden sm:block">
              About
            </a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
