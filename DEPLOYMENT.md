# SafeLinkEdu Deployment Guide

This guide will help you deploy the SafeLinkEdu backend and integrate it with your frontend.

## Prerequisites

1. **Supabase Account** - For database and authentication
2. **Vercel Account** - For backend deployment (free)
3. **Node.js 18+** - For local development
4. **Git** - For version control

## Step 1: Backend Setup

### 1.1 Clone and Install Dependencies

```bash
git clone <your-backend-repository>
cd safelinkedu-backend
npm install
```

### 1.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase Configuration (get from Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 1.3 Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Click **Run** to execute the schema

This will create:
- `admin_users` table
- `scans` table  
- `flagged_domains` table
- Default admin user (email: `admin@safelinkedu.com`, password: `admin123`)

**⚠️ IMPORTANT**: Change the default admin password immediately!

## Step 2: Backend Deployment (Vercel)

### 2.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 2.2 Deploy to Vercel

```bash
vercel --prod
```

Follow the prompts:
- Link to your Vercel account
- Set project name
- Confirm the directory (`.`)

### 2.3 Configure Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Find your project
3. Go to **Settings** → **Environment Variables**
4. Add all the variables from your `.env` file

### 2.4 Test Backend Deployment

Your backend will be available at: `https://your-project-name.vercel.app`

Test the health endpoint:
```bash
curl https://your-project-name.vercel.app/health
```

## Step 3: Frontend Integration

### 3.1 Update Frontend API Configuration

In your frontend project, create/update the API service:

```javascript
// services/apiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';
```

### 3.2 Add Environment Variables to Frontend

In your frontend `.env` file:

```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### 3.3 Update Frontend Components

Replace mock data with real API calls:

**HeroSection.tsx - Update handleScan function:**

```tsx
import apiService from '../services/apiService';

const handleScan = async () => {
  if (!url.trim()) return;
  
  setIsScanning(true);
  setScanResult(null);
  
  try {
    const response = await apiService.scanUrl(url);
    setScanResult(response.data);
  } catch (error) {
    console.error('Scan failed:', error);
    // Handle error appropriately
  } finally {
    setIsScanning(false);
  }
};
```

**AdminDashboard.tsx - Update data fetching:**

```tsx
import apiService from '../services/apiService';
import { useEffect, useState } from 'react';

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiService.getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  // Render dashboard with real data
}
```

### 3.4 Add Authentication to Frontend

Create an admin login component:

```tsx
// components/AdminLogin.tsx
import apiService from '../services/apiService';
import { useState } from 'react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        // Redirect to admin dashboard
        window.location.href = '/admin';
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form JSX */}
    </form>
  );
}
```

## Step 4: Frontend Deployment

### 4.1 Deploy Frontend to Vercel

If your frontend is also on Vercel:

```bash
cd ../your-frontend-directory
vercel --prod
```

### 4.2 Configure CORS

Update your backend environment variables in Vercel:

```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Step 5: Testing and Verification

### 5.1 Test URL Scanning

1. Go to your frontend
2. Enter a URL to scan
3. Verify the scan result appears
4. Check the data appears in admin dashboard

### 5.2 Test Admin Access

1. Navigate to `/admin` on your frontend
2. Login with admin credentials
3. Verify dashboard loads with real data
4. Test scan management features

### 5.3 Test API Endpoints

```bash
# Health check
curl https://your-backend.vercel.app/health

# URL scan
curl -X POST https://your-backend.vercel.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Admin login
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@safelinkedu.com","password":"admin123"}'
```

## Step 6: Production Considerations

### 6.1 Security

- Change default admin password
- Use strong JWT secret
- Enable rate limiting (if needed)
- Monitor API usage

### 6.2 Monitoring

- Set up Vercel analytics
- Monitor Supabase usage
- Set up error logging

### 6.3 Scaling

- Vercel automatically scales
- Supabase has generous free tier
- Consider upgrading for high traffic

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` matches your frontend domain
2. **Database Connection**: Verify Supabase credentials are correct
3. **Authentication Failures**: Check JWT secret is consistent
4. **Build Failures**: Ensure all dependencies are installed

### Debug Steps

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors

### Support

- Check Vercel deployment logs
- Review Supabase dashboard
- Test with Postman/curl
- Check GitHub issues

## Next Steps

1. **Enhanced Detection**: Add more external APIs
2. **Rate Limiting**: Implement usage limits
3. **Analytics**: Add detailed tracking
4. **Email Notifications**: Alert on high-risk scans
5. **User Accounts**: Add user registration system

Your SafeLinkEdu application is now live and ready for the hackathon! 🚀
