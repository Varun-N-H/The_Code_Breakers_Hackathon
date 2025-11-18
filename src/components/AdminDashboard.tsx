import { Shield, ExternalLink, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const mockScans = [
  { id: 1, timestamp: '2025-11-17 14:32:15', url: 'https://g00gle-forms.tk/verify-account', riskScore: 92, status: 'dangerous' },
  { id: 2, timestamp: '2025-11-17 14:28:43', url: 'https://forms.gle/abc123xyz', riskScore: 15, status: 'safe' },
  { id: 3, timestamp: '2025-11-17 14:21:09', url: 'https://student-portal-login.net/auth', riskScore: 78, status: 'suspicious' },
  { id: 4, timestamp: '2025-11-17 14:15:32', url: 'https://canvas.instructure.com/login', riskScore: 8, status: 'safe' },
  { id: 5, timestamp: '2025-11-17 14:09:54', url: 'https://urgentverification.link/student', riskScore: 95, status: 'dangerous' },
  { id: 6, timestamp: '2025-11-17 13:58:21', url: 'https://docs.google.com/forms/d/e/abc', riskScore: 12, status: 'safe' },
  { id: 7, timestamp: '2025-11-17 13:45:18', url: 'https://univ-portal-secure.xyz/exam', riskScore: 65, status: 'suspicious' },
  { id: 8, timestamp: '2025-11-17 13:32:47', url: 'https://blackboard.com/ultra/courses', riskScore: 5, status: 'safe' },
];

const topFlaggedDomains = [
  { domain: 'g00gle-forms.tk', count: 23 },
  { domain: 'urgentverification.link', count: 18 },
  { domain: 'student-portal-login.net', count: 15 },
  { domain: 'univ-secure-login.xyz', count: 12 },
  { domain: 'verify-student-account.com', count: 9 },
];

export function AdminDashboard() {
  const totalScans = 1247;
  const suspiciousCount = 189;
  const dangerousCount = 76;

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-50';
    if (score <= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskIcon = (status: string) => {
    if (status === 'safe') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'suspicious') return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-lg text-gray-900">SafeLinkEdu Admin</span>
            </div>
            <button className="text-gray-700 hover:text-blue-600 transition-colors text-sm">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Suspicious</p>
                <p className="text-3xl font-bold text-amber-600">{suspiciousCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dangerous</p>
                <p className="text-3xl font-bold text-red-600">{dangerousCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Scans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {scan.timestamp}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {scan.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRiskIcon(scan.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(scan.riskScore)}`}>
                            {scan.riskScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          View details
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top 5 Flagged Domains</h2>
            <div className="space-y-4">
              {topFlaggedDomains.map((domain, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{domain.domain}</p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(domain.count / topFlaggedDomains[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-gray-600">{domain.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
