import { AlertTriangle, CheckCircle, XCircle, Copy, Flag, ExternalLink } from 'lucide-react';

interface ResultCardProps {
  result: {
    riskScore: number;
    url: string;
    reasons: string[];
  };
  onOpenLink: () => void;
}

export function ResultCard({ result, onOpenLink }: ResultCardProps) {
  const { riskScore, url, reasons } = result;

  const getRiskLevel = () => {
    if (riskScore <= 30) return { level: 'Safe', color: 'green', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    if (riskScore <= 70) return { level: 'Suspicious', color: 'amber', icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { level: 'Dangerous', color: 'red', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  const risk = getRiskLevel();
  const RiskIcon = risk.icon;

  const handleCopyReport = () => {
    const report = `SafeLinkEdu Scan Report\nURL: ${url}\nRisk Score: ${riskScore}/100 (${risk.level})\n\nReasons:\n${reasons.map(r => `- ${r}`).join('\n')}`;
    navigator.clipboard.writeText(report);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 ${risk.border}`}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className={`${risk.bg} rounded-full p-4 mb-4`}>
          <RiskIcon className={`w-12 h-12 ${risk.text}`} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{risk.level}</h3>
        <div className="flex items-center gap-2">
          <span className="text-4xl sm:text-5xl font-bold" style={{ color: risk.color === 'green' ? '#16a34a' : risk.color === 'amber' ? '#d97706' : '#dc2626' }}>
            {riskScore}
          </span>
          <span className="text-2xl text-gray-400">/100</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Detection Details:</h4>
        <ul className="space-y-2">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopyReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy report
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
          <Flag className="w-4 h-4" />
          Report as phishing
        </button>
        <button
          onClick={onOpenLink}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open original link
        </button>
      </div>
    </div>
  );
}
