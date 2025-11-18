import { Router, Request, Response } from 'express';
import { supabaseAdmin, TABLES } from '../config/supabase';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  // Get total scans
  const { data: allScans, error: scansError } = await supabaseAdmin
    .from(TABLES.SCANS)
    .select('status, created_at')
    .order('created_at', { ascending: false });

  if (scansError) {
    throw new AppError('Failed to fetch dashboard data', 500);
  }

  const totalScans = allScans?.length || 0;
  const suspiciousCount = allScans?.filter(scan => scan.status === 'suspicious').length || 0;
  const dangerousCount = allScans?.filter(scan => scan.status === 'dangerous').length || 0;

  // Get recent scans (last 50)
  const { data: recentScans, error: recentError } = await supabaseAdmin
    .from(TABLES.SCANS)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (recentError) {
    throw new AppError('Failed to fetch recent scans', 500);
  }

  // Get top flagged domains
  const { data: flaggedDomains, error: domainsError } = await supabaseAdmin
    .from(TABLES.FLAGGED_DOMAINS)
    .select('*')
    .order('count', { ascending: false })
    .limit(10);

  if (domainsError) {
    // If table doesn't exist, we'll create it from scan data
    const domainCounts = new Map<string, number>();
    
    allScans?.forEach(scan => {
      try {
        const url = new URL(scan.url || '');
        const domain = url.hostname;
        if (scan.status !== 'safe') {
          domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
        }
      } catch (e) {
        // Skip invalid URLs
      }
    });

    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    res.json({
      success: true,
      data: {
        stats: {
          totalScans,
          suspiciousCount,
          dangerousCount
        },
        recentScans: recentScans || [],
        topFlaggedDomains: topDomains
      }
    });
  } else {
    res.json({
      success: true,
      data: {
        stats: {
          totalScans,
          suspiciousCount,
          dangerousCount
        },
        recentScans: recentScans || [],
        topFlaggedDomains: flaggedDomains || []
      }
    });
  }
}));

// GET /api/admin/scans - Get all scans with pagination
router.get('/scans', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  const status = req.query.status as string;

  let query = supabaseAdmin
    .from(TABLES.SCANS)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && ['safe', 'suspicious', 'dangerous'].includes(status)) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    throw new AppError('Failed to fetch scans', 500);
  }

  res.json({
    success: true,
    data: data || [],
    pagination: {
      limit,
      offset,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    }
  });
}));

// GET /api/admin/scans/:id - Get scan details
router.get('/scans/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from(TABLES.SCANS)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new AppError('Scan not found', 404);
  }

  res.json({
    success: true,
    data
  });
}));

// DELETE /api/admin/scans/:id - Delete a scan record
router.delete('/scans/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from(TABLES.SCANS)
    .delete()
    .eq('id', id);

  if (error) {
    throw new AppError('Failed to delete scan', 500);
  }

  res.json({
    success: true,
    message: 'Scan deleted successfully'
  });
}));

// GET /api/admin/stats - Get detailed statistics
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabaseAdmin
    .from(TABLES.SCANS)
    .select('status, created_at, risk_score')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new AppError('Failed to fetch statistics', 500);
  }

  // Calculate daily statistics
  const dailyStats = new Map<string, { safe: number; suspicious: number; dangerous: number }>();
  
  data?.forEach(scan => {
    const date = scan.created_at?.split('T')[0] || new Date().toISOString().split('T')[0];
    if (!dailyStats.has(date)) {
      dailyStats.set(date, { safe: 0, suspicious: 0, dangerous: 0 });
    }
    const stats = dailyStats.get(date)!;
    stats[scan.status]++;
  });

  // Calculate risk distribution
  const riskRanges = {
    low: data?.filter(scan => scan.risk_score <= 30).length || 0,
    medium: data?.filter(scan => scan.risk_score > 30 && scan.risk_score <= 70).length || 0,
    high: data?.filter(scan => scan.risk_score > 70).length || 0
  };

  res.json({
    success: true,
    data: {
      dailyStats: Array.from(dailyStats.entries()).map(([date, stats]) => ({
        date,
        ...stats
      })),
      riskRanges,
      totalScans: data?.length || 0,
      period: `${days} days`
    }
  });
}));

export { router as adminRouter };
