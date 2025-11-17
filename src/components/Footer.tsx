import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">SafeLinkEdu</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <a href="#privacy" className="hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#terms" className="hover:text-white transition-colors text-sm">
              Terms
            </a>
            <a href="#contact" className="hover:text-white transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2025 SafeLinkEdu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
