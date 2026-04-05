# 🚀 FinSight Backend Deployment Guide

## 🎯 **CORS Issue Solution for Render**

The "Failed to fetch" error you're experiencing is due to CORS configuration that wasn't optimized for production deployment. This guide contains the complete fix.

## ✅ **Fixes Applied**

### **1. Enhanced CORS Configuration**
- **Dynamic origin handling** for production and development
- **Same-origin requests allowed** for Swagger UI
- **Render domain support** (*.onrender.com)
- **Preflight request handling** with OPTIONS method

### **2. Updated Swagger Configuration**
- **HTTPS server URLs** for production
- **Dynamic hostname detection** using RENDER_EXTERNAL_HOSTNAME
- **Proper base URL configuration**

### **3. Production-Ready Server**
- **Environment variable validation**
- **Dynamic PORT handling** (Render requirement)
- **Graceful shutdown** for production deployment

## 🔧 **Required Environment Variables for Render**

Add these environment variables in your Render dashboard:

### **Essential Variables:**
```bash
NODE_ENV=production
DATABASE_URL=your_neon_postgresql_connection_string_here
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
```

### **Optional Variables (for enhanced functionality):**
```bash
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.com,https://your-app.com
BCRYPT_ROUNDS=12
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

### **Render Auto-Provided Variables:**
```bash
PORT=10000                    # Auto-provided by Render
RENDER_EXTERNAL_HOSTNAME=     # Auto-provided by Render
```

## 🌐 **Render Deployment Steps**

### **Step 1: Environment Variables**
1. Go to your service in Render dashboard
2. Navigate to "Environment" tab
3. Add the required variables above
4. **Important**: Make sure `NODE_ENV=production` is set

### **Step 2: Deploy Latest Code**
```bash
# Your code is already pushed to GitHub
# Render will auto-deploy the latest changes
```

### **Step 3: Verify Deployment**
1. **Health Check**: `https://your-service.onrender.com/health`
2. **API Docs**: `https://your-service.onrender.com/api-docs`
3. **API Base**: `https://your-service.onrender.com/api/v1`

## 🔍 **Testing the Fix**

### **1. Health Check Test**
```bash
curl https://your-service-name.onrender.com/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "FinSight Backend is healthy",
  "timestamp": "2026-04-05T...",
  "environment": "production",
  "version": "1.0.0"
}
```

### **2. Swagger UI Test**
1. Visit: `https://your-service-name.onrender.com/api-docs`
2. You should see the Swagger interface without CORS errors
3. Try the "Try it out" functionality

### **3. API Endpoint Test**
```bash
curl -X POST https://your-service-name.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123","role":"VIEWER"}'
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still getting CORS errors**
**Solution**: 
- Ensure `NODE_ENV=production` is set in Render
- Check that `CORS_ORIGIN` includes your frontend domain
- Clear browser cache and try again

### **Issue 2: Database connection errors**
**Solution**:
- Verify `DATABASE_URL` is correctly set with Neon connection string
- Ensure the database is accessible (not paused/hibernated)
- Check Neon dashboard for connection issues

### **Issue 3: JWT token errors**
**Solution**:
- Ensure `JWT_SECRET` is at least 32 characters long
- Use a cryptographically secure random string
- Don't include any special characters that might need escaping

### **Issue 4: Swagger UI not loading**
**Solution**:
- Check that the service is running on HTTPS (Render auto-provides this)
- Verify the `RENDER_EXTERNAL_HOSTNAME` is correctly detected
- Try accessing `/health` first to ensure the service is running

## 🎯 **Post-Deployment Checklist**

- [ ] Health endpoint returns 200 OK
- [ ] Swagger UI loads without CORS errors
- [ ] Authentication endpoints work (register/login)
- [ ] Database connection is stable
- [ ] All API endpoints respond correctly
- [ ] JWT authentication is working
- [ ] Role-based access control is enforced

## 🔄 **Auto-Deployment**

Your Render service is configured for auto-deployment:
- **Any push to GitHub main branch** triggers a new deployment
- **Build process** runs automatically
- **Database migrations** are applied during build
- **Zero-downtime** deployment process

## 📈 **Monitoring**

### **Render Dashboard**
- **Logs**: Monitor application logs in real-time
- **Metrics**: CPU, memory, and network usage
- **Events**: Deployment history and status

### **Health Monitoring**
- Set up external monitoring (UptimeRobot, Better Uptime)
- Monitor the `/health` endpoint every 5 minutes
- Set up alerts for downtime or errors

## 🎉 **Success Indicators**

You'll know the fix worked when:
1. ✅ Swagger UI loads without "Failed to fetch" errors
2. ✅ All API endpoints work in Swagger "Try it out"
3. ✅ No CORS policy violations in browser console
4. ✅ Health check returns successful response
5. ✅ Database operations work correctly

## 📞 **Need Help?**

If you're still experiencing issues:
1. Check Render service logs for error messages
2. Verify all environment variables are set correctly
3. Test the health endpoint first
4. Clear browser cache and try incognito mode
5. Check Neon database status and connection

Your FinSight Backend is now production-ready and should work flawlessly on Render! 🚀