import { Router, Request, Response } from 'express';
import { scanService, ScanResult } from '../services/scanService';
import { supabase, TABLES, ScanRecord } from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

interface ScanRequest {
  url: string;
}

interface ScanResponse {
  success: boolean;
  data?: ScanResult;
  message?: string;
}

// POST /api/scan - Scan a URL for phishing
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { url }: ScanRequest = req.body;

  if (!url) {
    throw new AppError('URL is required', 400);
  }

  // Perform the scan
  const scanResult = await scanService.scanUrl(url);

  // Save scan result to database
  try {
    const scanRecord: Omit<ScanRecord, 'id'> = {
      url: scanResult.url,
      risk_score: scanResult.riskScore,
      status: scanResult.status,
      reasons: scanResult.reasons,
      user_ip: req.ip,
      user_agent: req.get('User-Agent')
    };

    const { error } = await supabase
      .from(TABLES.SCANS)
      .insert(scanRecord);

    if (error) {
      console.error('Database error:', error);
      // Continue even if database save fails
    }
  } catch (dbError) {
    console.error('Database save failed:', dbError);
    // Continue even if database save fails
  }

  const response: ScanResponse = {
    success: true,
    data: scanResult
  };

  res.json(response);
}));

// GET /api/scan/history - Get recent scan history (public, limited)
router.get('/history', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const { data, error } = await supabase
    .from(TABLES.SCANS)
    .select('url, risk_score, status, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    throw new AppError('Failed to fetch scan history', 500);
  }

  res.json({
    success: true,
    data: data || [],
    pagination: {
      limit,
      offset,
      total: data?.length || 0
    }
  });
}));

// GET /api/scan/stats - Get public statistics
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from(TABLES.SCANS)
    .select('status')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw new AppError('Failed to fetch statistics', 500);
  }

  const stats = {
    totalScans: data?.length || 0,
    safe: data?.filter(scan => scan.status === 'safe').length || 0,
    suspicious: data?.filter(scan => scan.status === 'suspicious').length || 0,
    dangerous: data?.filter(scan => scan.status === 'dangerous').length || 0
  };

  res.json({
    success: true,
    data: stats
  });
}));

export { router as scanRouter };
