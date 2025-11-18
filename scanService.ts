import validator from 'validator';
import axios from 'axios';

export interface ScanResult {
  url: string;
  riskScore: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  reasons: string[];
  scanTime: number;
}

export interface ExternalAPIResponse {
  safe: boolean;
  riskScore?: number;
  reasons?: string[];
}

class ScanService {
  // Suspicious keywords commonly found in phishing URLs
  private readonly suspiciousKeywords = [
    'verify', 'urgent', 'suspended', 'account', 'login', 'secure',
    'update', 'confirm', 'payment', 'billing', 'expire', 'limited',
    'immediate', 'action', 'required', 'click', 'download', 'install'
  ];

  // Suspicious TLDs commonly used for phishing
  private readonly suspiciousTLDs = [
    '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.loan',
    '.win', '.click', '.link', '.shop', '.online', '.site'
  ];

  // Known legitimate domains (whitelist)
  private readonly legitimateDomains = [
    'google.com', 'forms.gle', 'docs.google.com', 'canvas.instructure.com',
    'blackboard.com', 'moodle.org', 'edmodo.com', 'khanacademy.org',
    'coursera.org', 'edx.org', 'udemy.com', 'zoom.us', 'microsoft.com',
    'office.com', 'outlook.com', 'teams.microsoft.com'
  ];

  async scanUrl(url: string): Promise<ScanResult> {
    const startTime = Date.now();
    
    try {
      // Validate URL format
      if (!validator.isURL(url, { require_protocol: true })) {
        return this.createResult(url, 95, 'dangerous', ['Invalid URL format'], Date.now() - startTime);
      }

      const reasons: string[] = [];
      let riskScore = 0;

      // Parse URL components
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname.toLowerCase();
      const path = parsedUrl.pathname.toLowerCase();

      // Check against legitimate domains
      if (this.isLegitimateDomain(domain)) {
        return this.createResult(url, 5, 'safe', ['Known legitimate domain'], Date.now() - startTime);
      }

      // Domain analysis
      const domainRisk = this.analyzeDomain(domain);
      riskScore += domainRisk.score;
      reasons.push(...domainRisk.reasons);

      // Path analysis
      const pathRisk = this.analyzePath(path);
      riskScore += pathRisk.score;
      reasons.push(...pathRisk.reasons);

      // URL length analysis
      if (url.length > 100) {
        riskScore += 10;
        reasons.push('Unusually long URL');
      }

      // HTTPS check
      if (!url.startsWith('https://')) {
        riskScore += 15;
        reasons.push('Not using HTTPS encryption');
      }

      // External API checks (mock for now - would integrate real APIs)
      const externalRisk = await this.checkExternalAPIs(url);
      riskScore += externalRisk.score;
      reasons.push(...externalRisk.reasons);

      // Cap the risk score at 100
      riskScore = Math.min(riskScore, 100);

      // Determine status
      let status: 'safe' | 'suspicious' | 'dangerous';
      if (riskScore <= 30) {
        status = 'safe';
      } else if (riskScore <= 70) {
        status = 'suspicious';
      } else {
        status = 'dangerous';
      }

      return this.createResult(url, riskScore, status, reasons, Date.now() - startTime);

    } catch (error) {
      return this.createResult(url, 50, 'suspicious', ['Error scanning URL'], Date.now() - startTime);
    }
  }

  private isLegitimateDomain(domain: string): boolean {
    return this.legitimateDomains.some(legit => 
      domain === legit || domain.endsWith('.' + legit)
    );
  }

  private analyzeDomain(domain: string): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // Check for suspicious TLD
    const suspiciousTLD = this.suspiciousTLDs.find(tld => domain.endsWith(tld));
    if (suspiciousTLD) {
      score += 25;
      reasons.push(`Suspicious top-level domain: ${suspiciousTLD}`);
    }

    // Check for domain spoofing
    if (this.hasSpoofingPatterns(domain)) {
      score += 30;
      reasons.push('Domain appears to be spoofing a legitimate service');
    }

    // Check for numbers in domain
    if (/\d/.test(domain.split('.')[0])) {
      score += 10;
      reasons.push('Domain contains numbers (common in phishing)');
    }

    // Check for hyphens in domain
    if ((domain.match(/-/g) || []).length > 2) {
      score += 15;
      reasons.push('Multiple hyphens in domain name');
    }

    // Check domain length
    if (domain.length > 30) {
      score += 10;
      reasons.push('Unusually long domain name');
    }

    return { score, reasons };
  }

  private analyzePath(path: string): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // Check for suspicious keywords in path
    const foundKeywords = this.suspiciousKeywords.filter(keyword => 
      path.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      score += foundKeywords.length * 8;
      reasons.push(`Suspicious keywords in URL: ${foundKeywords.join(', ')}`);
    }

    // Check for random-looking strings
    const randomPattern = /[a-f0-9]{20,}/i;
    if (randomPattern.test(path)) {
      score += 15;
      reasons.push('Contains random-looking strings');
    }

    return { score, reasons };
  }

  private hasSpoofingPatterns(domain: string): boolean {
    const patterns = [
      /goog1e/i,    // Google with 1 instead of l
      /g00gle/i,    // Google with 0 instead of o
      /faceb00k/i,  // Facebook with 0 instead of o
      /amaz0n/i,    // Amazon with 0 instead of o
      /micros0ft/i, // Microsoft with 0 instead of o
      /paypa1/i,    // PayPal with 1 instead of l
    ];

    return patterns.some(pattern => pattern.test(domain));
  }

  private async checkExternalAPIs(url: string): Promise<{ score: number; reasons: string[] }> {
    const reasons: string[] = [];
    let score = 0;

    try {
      // Mock external API checks
      // In production, these would be real API calls to:
      // - Google Safe Browsing API
      // - URLVoid API
      // - VirusTotal API
      // - PhishTank API

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock responses for demo
      if (url.includes('suspicious') || url.includes('fake')) {
        score += 40;
        reasons.push('Flagged by external security services');
      }

      if (url.includes('tk/') || url.includes('ml/')) {
        score += 20;
        reasons.push('Domain flagged as high-risk by security databases');
      }

    } catch (error) {
      reasons.push('External security check unavailable');
    }

    return { score, reasons };
  }

  private createResult(
    url: string, 
    riskScore: number, 
    status: 'safe' | 'suspicious' | 'dangerous',
    reasons: string[],
    scanTime: number
  ): ScanResult {
    return {
      url,
      riskScore,
      status,
      reasons,
      scanTime
    };
  }
}

export const scanService = new ScanService();
