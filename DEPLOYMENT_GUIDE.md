# HelloDoctor Deployment Guide

This guide will help you deploy your HelloDoctor application to production using Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account (for connecting to Vercel and Render)
- MongoDB Atlas database (already configured)
- Git installed locally

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd d:\HelloDoctor\HelloDoctor
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `HelloDoctor`
3. Don't initialize with README (you already have files)
4. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/HelloDoctor.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up / Login to Render
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your `HelloDoctor` repository
3. Configure the service:
   - **Name**: `hellodoctor-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select your preferred plan)

### 2.3 Add Environment Variables
In the Environment section, add these variables:

```
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://verulkarpallavi1686_db_user:Verulkar1234@cluster0.sqtjrux.mongodb.net/HelloDoctor?retryWrites=true&w=majority
JWT_SECRET=generate-a-random-32-character-secret-here
FRONTEND_URL=https://your-app-name.vercel.app
ADMIN_EMAIL=admin@hellodoctor.com
ADMIN_PASSWORD=your-secure-admin-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Important**: 
- Generate a strong JWT_SECRET (at least 32 characters)
- You'll update FRONTEND_URL after deploying frontend
- For EMAIL_PASS, use Gmail App Password (not your regular password)

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://hellodoctor-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Environment
Before deploying, update the backend URL:

1. Open `my-react-app/.env.production`
2. Replace the URL with your Render backend URL:
```
VITE_API_URL=https://hellodoctor-backend.onrender.com
```
3. Commit and push:
```bash
git add .
git commit -m "Update backend URL for production"
git push
```

### 3.2 Sign Up / Login to Vercel
1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 3.3 Import Project
1. Click "Add New..." → "Project"
2. Import your `HelloDoctor` repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `my-react-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.4 Add Environment Variable
In the Environment Variables section:
```
VITE_API_URL=https://hellodoctor-backend.onrender.com
```
(Use your actual Render backend URL)

### 3.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://hellodoctor.vercel.app`)

---

## Step 4: Update Backend with Frontend URL

### 4.1 Update Render Environment
1. Go back to Render dashboard
2. Open your `hellodoctor-backend` service
3. Go to "Environment" tab
4. Update the `FRONTEND_URL` variable with your Vercel URL:
```
FRONTEND_URL=https://hellodoctor.vercel.app
```
5. Save changes (this will trigger a redeployment)

---

## Step 5: Verify Deployment

### 5.1 Test Backend Health
Open in browser:
```
https://hellodoctor-backend.onrender.com/api/health
```
Should return: `{"status":"ok"}`

### 5.2 Test Frontend
1. Open your Vercel URL: `https://hellodoctor.vercel.app`
2. Try to register/login
3. Test booking appointments
4. Check if all features work correctly

---

## Step 6: Configure File Uploads (Important!)

Your current setup stores uploads locally, which won't work on Render (filesystem is ephemeral).

### Option 1: Use Cloudinary (Recommended)
You already have cloudinary in your dependencies. Update your upload middleware to use Cloudinary storage instead of local storage.

1. Sign up at https://cloudinary.com
2. Get your credentials
3. Add to Render environment variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Option 2: Use Render Disk
Upgrade to a paid Render plan that includes persistent disk storage.

---

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB URI is correct
- Check if JWT_SECRET is at least 32 characters

### Frontend Issues
- Check build logs in Vercel dashboard
- Verify VITE_API_URL is correct
- Check browser console for CORS errors
- Ensure backend FRONTEND_URL matches your Vercel domain

### CORS Errors
Make sure backend's FRONTEND_URL exactly matches your Vercel domain (no trailing slash)

### Database Connection Issues
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access
- Check if database name is `HelloDoctor` (not `aeromobility`)

---

## Automatic Deployments

Both Vercel and Render are now connected to your GitHub repository:
- **Any push to `main` branch** will trigger automatic redeployment
- Frontend and backend will update automatically

---

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### For Backend (Render):
1. Upgrade to paid plan
2. Go to Settings → Custom Domain
3. Add your domain and configure DNS

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB Atlas IP whitelist (or use 0.0.0.0/0 for cloud deployments)
- [ ] Use Gmail App Password for email service
- [ ] Never commit `.env` files to Git
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Review CORS settings
- [ ] Set up monitoring and alerts

---

## Cost Breakdown (Free Tier)

- **Vercel**: Free (Hobby plan)
  - 100 GB bandwidth/month
  - Unlimited sites
  - Automatic HTTPS

- **Render**: Free
  - 750 hours/month
  - Spins down after 15 minutes of inactivity
  - 512 MB RAM
  - **Note**: First request after inactivity may take 30-60 seconds

- **MongoDB Atlas**: Free (M0 cluster)
  - 512 MB storage
  - Shared RAM
  - No automatic backups

**Total Cost**: $0/month (with limitations)

### Upgrade Recommendations
- Render Starter ($7/month): No spin-down, better performance
- MongoDB M2 ($9/month): 2GB storage, automated backups
- Cloudinary Free: 25GB storage, 25GB bandwidth

---

## Next Steps

1. Set up monitoring (Render provides basic monitoring)
2. Configure custom domain
3. Set up email notifications
4. Add backup strategy for database
5. Implement logging and error tracking (e.g., Sentry)
6. Set up staging environment
7. Configure CI/CD for automated testing

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Render logs (in dashboard)
3. Review Vercel logs (in dashboard)
4. Check MongoDB Atlas logs

---

**Deployment Date**: [Add date when you deploy]
**Deployed By**: [Your name]
**Production URLs**: 
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com
