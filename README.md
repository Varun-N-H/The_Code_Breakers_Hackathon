<<<<<<< HEAD
# SafeLinkEdu Backend API

Backend API for SafeLinkEdu - AI-powered phishing detection for educational links.

## Features

- 🔍 **URL Scanning**: Real-time phishing detection with risk scoring
- 🛡️ **Security Analysis**: Domain reputation, SSL checks, content analysis
- 📊 **Admin Dashboard**: Analytics, scan history, user management
- 🔐 **JWT Authentication**: Secure admin access
- 🗄️ **Supabase Integration**: Scalable database with real-time updates
- 🚀 **Production Ready**: Error handling, logging, security middleware

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Security**: Helmet, CORS, bcrypt
- **Validation**: Custom URL analysis + external APIs

## Quick Start

### 1. Prerequisites

- Node.js 18+ 
- Supabase account
- Git

### 2. Clone & Install

```bash
git clone <repository-url>
cd safelinkedu-backend
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d

# External API Keys (Optional - for enhanced detection)
URLVOID_API_KEY=your_urlvoid_api_key
GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL Editor
3. Update your `.env` with Supabase credentials

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Public Endpoints

#### URL Scanning
- `POST /api/scan` - Scan a URL for phishing
- `GET /api/scan/history` - Get recent scan history (limited)
- `GET /api/scan/stats` - Get public statistics

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/setup` - Create initial admin user

### Admin Endpoints (Authentication Required)

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/scans` - Get all scans with pagination
- `GET /api/admin/scans/:id` - Get scan details
- `DELETE /api/admin/scans/:id` - Delete scan record
- `GET /api/admin/stats` - Get detailed statistics

### System
- `GET /health` - Health check endpoint

## API Usage Examples

### Scan a URL

```bash
curl -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "riskScore": 15,
    "status": "safe",
    "reasons": ["Known legitimate domain"],
    "scanTime": 245
  }
}
```

### Admin Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### Access Admin Dashboard

```bash
curl -X GET http://localhost:3001/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Risk Scoring Algorithm

The system analyzes URLs using multiple factors:

### Domain Analysis (40% weight)
- Suspicious TLDs (.tk, .ml, .ga, etc.)
- Domain spoofing patterns
- Numbers and special characters
- Domain length

### Path Analysis (25% weight)
- Suspicious keywords (verify, urgent, suspended, etc.)
- Random-looking strings
- Unusual path structures

### Security Checks (20% weight)
- HTTPS usage
- SSL certificate validity
- External security databases

### Content Analysis (15% weight)
- Form patterns
- Phishing indicators
- External API results

### Risk Levels
- **0-30**: Safe
- **31-70**: Suspicious
- **71-100**: Dangerous

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard
4. Update CORS configuration for your frontend URL

### Render

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build
docker build -t safelinkedu-backend .

# Run
docker run -p 3001:3001 --env-file .env safelinkedu-backend
```

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse (implement as needed)
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries via Supabase

## Monitoring & Logging

- Structured error logging
- Request/response logging
- Performance monitoring
- Database query optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

## Default Admin Credentials

**⚠️ IMPORTANT**: Change the default password immediately after setup!

- Email: `admin@safelinkedu.com`
- Password: `admin123`

To change the password, use the `/api/auth/setup` endpoint or update directly in the database.
=======
The_Code_Breakers_Hackathon
>>>>>>> ae8785dd0282a2a1ac826c985292b4dad66ed036

the demo video of the above website is given below
https://youtube.com/shorts/FjD8xuc6BaE?si=FOJWolE-q-JzwRFv
