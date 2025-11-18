import { AlertTriangle, X } from 'lucide-react';

interface UnsafeLinkModalProps {
  onClose: () => void;
  url: string;
}

export function UnsafeLinkModal({ onClose, url }: UnsafeLinkModalProps) {
  const handleProceed = () => {
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Unsafe Link Warning
          </h3>

          <p className="text-gray-600 mb-6">
            This link has been flagged as potentially dangerous. Proceeding may expose you to phishing attempts or malware.
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={handleProceed}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
            >
              Proceed anyway
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            If you believe this is a false positive, report it to help improve detection.
          </p>
        </div>
      </div>
    </div>
  );
}
