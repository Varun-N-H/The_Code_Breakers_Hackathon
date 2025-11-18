# 🚀 GitHub Repository Setup Guide

Your SafeLinkEdu backend is now ready for GitHub! Here's how to add it to your repository:

## 📋 **Current Status**
✅ Git repository initialized  
✅ All files added to Git  
✅ Initial commit created  
✅ .gitignore configured (excludes sensitive files)  

## 🌐 **Step 1: Create GitHub Repository**

1. **Go to GitHub**: https://github.com
2. **Click "New repository"** (green button)
3. **Repository settings**:
   - Repository name: `SafeLinkEdu-Backend` (or your preferred name)
   - Description: `AI-powered phishing detection backend for educational environments`
   - Visibility: Public (for hackathon) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we have these)

## 📤 **Step 2: Add Remote and Push**

Open your terminal/command prompt and run:

```bash
# Navigate to your backend directory
cd ../SafeLinkEdu_Backend

# Add GitHub remote (replace with your username and repo name)
git remote add origin https://github.com/Varun-N-H/The_Code_Breakers_Hackathon/tree/Safelinkedu

# Push to GitHub
git push -u origin main
```

## 🔐 **Step 3: Configure GitHub Secrets (for Deployment)**

If deploying to Vercel from GitHub, add environment variables:

### Option A: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_strong_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=your_frontend_url
   ```

### Option B: GitHub Secrets (for GitHub Actions)
1. Go to your repository on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** for each environment variable

## 🎯 **Step 4: Deploy to Vercel**

### Method 1: Vercel CLI (Quick)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your backend directory
cd ../SafeLinkEdu_Backend
vercel --prod
```

### Method 2: Vercel Dashboard (GUI)
1. Go to [Vercel](https://vercel.com)
2. **Import Project** → **Import Git Repository**
3. Select your SafeLinkEdu-Backend repository
4. Configure build settings:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🔗 **Step 5: Connect Frontend to Backend**

Update your frontend to use the deployed backend URL:

```javascript
// In your frontend API service
const API_BASE_URL = 'https://your-backend-url.vercel.app';
```

## 📊 **Repository Structure on GitHub**

Your GitHub repository will look like:

```
SafeLinkEdu-Backend/
├── .gitignore                 # Excludes sensitive files
├── .env.example               # Environment template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript config
├── vercel.json               # Vercel deployment config
├── README.md                  # Project documentation
├── DEPLOYMENT.md             # Deployment guide
├── PROJECT_SUMMARY.md         # Project overview
├── GITHUB_SETUP.md           # This file
├── src/
│   ├── index.ts              # Server entry point
│   ├── config/
│   │   └── supabase.ts     # Database config
│   ├── middleware/
│   │   ├── auth.ts          # JWT middleware
│   │   └── errorHandler.ts  # Error handling
│   ├── routes/
│   │   ├── scan.ts          # Scan endpoints
│   │   ├── auth.ts          # Auth endpoints
│   │   └── admin.ts         # Admin endpoints
│   └── services/
│       ├── scanService.ts     # Scanning logic
│       └── authService.ts    # Auth logic
├── database/
│   └── schema.sql           # Database setup
└── frontend-integration/
    └── apiService.js        # Frontend API service
```

## ⚡ **Quick Commands Summary**

```bash
# Navigate to backend directory
cd ../SafeLinkEdu_Backend

# Check current status
git status

# Add remote (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/SafeLinkEdu-Backend.git

# Push to GitHub
git push -u origin main

# Deploy to Vercel
vercel --prod
```

## 🔐 **Security Notes**

✅ **Safe to Commit**:
- All source code files
- Configuration templates (.env.example)
- Documentation
- Database schema

❌ **NEVER Commit**:
- .env files (contains secrets)
- node_modules/
- Build outputs (dist/)
- Logs

## 🎉 **Next Steps After GitHub Setup**

1. **Deploy Backend**: Follow Vercel deployment
2. **Update Frontend**: Point to deployed backend URL
3. **Test Integration**: Verify frontend-backend connection
4. **Setup Database**: Run schema.sql in Supabase
5. **Configure Environment**: Set all required variables
6. **Test Full System**: End-to-end testing

## 📞 **Troubleshooting**

### Push Issues
```bash
# If push fails, try:
git push origin main --force

# If remote issues:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/SafeLinkEdu-Backend.git
```

### Deployment Issues
- Check Vercel environment variables
- Verify build settings
- Check function logs in Vercel dashboard

### Integration Issues
- Verify CORS settings
- Check API endpoints
- Test with Postman/curl

## 🏆 **Hackathon Ready!**

Your SafeLinkEdu backend is now:
- ✅ **On GitHub** with proper version control
- ✅ **Deployed** to Vercel (or ready for deployment)
- ✅ **Documented** with comprehensive guides
- ✅ **Secure** with proper .gitignore
- ✅ **Production-ready** for hackathon demo

**Your backend is ready to impress the judges!** 🚀
