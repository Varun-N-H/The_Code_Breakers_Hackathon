import { Loader2, Search } from 'lucide-react';

export function ScanningAnimation() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <Search className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Scanning link...</h3>
        <p className="text-gray-600 text-center">Analyzing domain, SSL certificate, and content patterns</p>

        <div className="w-full max-w-md mt-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
