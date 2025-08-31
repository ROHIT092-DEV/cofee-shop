# Production Setup Guide

## Environment Variables for Render

**CRITICAL**: Set these environment variables in your Render dashboard:

```
MONGODB_URI=mongodb+srv://prohit2914:rohit@cluster0.g9m7oxu.mongodb.net/coffeeshop?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_SECRET=coffee-shop-nextauth-secret-2024-production
NEXTAUTH_URL=https://cofee-shop-tts9.onrender.com
JWT_SECRET=coffee-shop-jwt-secret-2024-production
```

**The JWT_SECRET is REQUIRED** - without it, all admin functions will fail with 500 errors.

## Steps to Fix Production Issues:

1. **Set Environment Variables in Render:**
   - Go to your Render dashboard
   - Select your service
   - Go to Environment tab
   - Add the above environment variables

2. **Redeploy:**
   - After setting environment variables, redeploy your service
   - This ensures the new variables are loaded

3. **Check Logs:**
   - Monitor the deployment logs for any errors
   - Check runtime logs for API errors

## Common Issues Fixed:

✅ **Database Connection**: Fixed import names from `dbConnect` to `connectDB`
✅ **API Routes**: All routes now use correct import
✅ **Delete Functionality**: Added DELETE method to orders API
✅ **Environment Variables**: Production values ready for Render

## Test Checklist:

- [ ] Homepage loads with products
- [ ] User registration works
- [ ] User login works
- [ ] Customer dashboard shows menu
- [ ] Admin dashboard shows all sections
- [ ] Order placement works
- [ ] Delete order functionality works (admin)

## If Still Having Issues:

1. Check Render logs for specific errors
2. Verify MongoDB Atlas allows connections from Render IPs
3. Ensure all environment variables are set correctly
4. Try a fresh deployment