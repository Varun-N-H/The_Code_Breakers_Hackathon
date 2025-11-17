import { Shield, CheckCircle, Globe, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { ScanningAnimation } from './ScanningAnimation';
import { ResultCard } from './ResultCard';
import { UnsafeLinkModal } from './UnsafeLinkModal';

export function HeroSection() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showUnsafeModal, setShowUnsafeModal] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockResult = {
      riskScore: Math.floor(Math.random() * 100),
      url: url,
      reasons: [
        'Domain age: 2 days',
        'Contains "verify", "urgent" keywords',
        'Cloned Google Form patterns detected',
        'SSL certificate recently issued'
      ]
    };

    setScanResult(mockResult);
    setIsScanning(false);
  };

  const handleOpenLink = () => {
    setShowUnsafeModal(true);
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Is this link safe for students?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Paste a Google Form, assignment link, or exam portal to check for phishing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link here (e.g., https://forms.gle/xyz...)"
              className="flex-1 px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base sm:text-lg"
              disabled={isScanning}
            />
            <button
              onClick={handleScan}
              disabled={isScanning || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-colors whitespace-nowrap"
            >
              Scan Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Detects fake Google Forms</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Identifies look-alike college portals</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">One-tap mobile verification</span>
            </div>
          </div>
        </div>

        {isScanning && <ScanningAnimation />}
        {scanResult && <ResultCard result={scanResult} onOpenLink={handleOpenLink} />}

        {showUnsafeModal && (
          <UnsafeLinkModal
            onClose={() => setShowUnsafeModal(false)}
            url={scanResult?.url}
          />
        )}
      </div>
    </section>
  );
}
