# 🚀 Quick Deployment Steps

Follow these steps to deploy HelloDoctor in ~15 minutes:

## 1️⃣ Push to GitHub (5 minutes)

```bash
cd d:\HelloDoctor\HelloDoctor
git init
git add .
git commit -m "Ready for deployment"
```

Create repo on GitHub: https://github.com/new
Then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/HelloDoctor.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Deploy Backend on Render (5 minutes)

1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Select your `HelloDoctor` repo
4. **Configuration:**
   - Name: `hellodoctor-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Add Environment Variables:**
```
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://verulkarpallavi1686_db_user:Verulkar1234@cluster0.sqtjrux.mongodb.net/HelloDoctor?retryWrites=true&w=majority
JWT_SECRET=change-this-to-a-random-32-character-secret
FRONTEND_URL=https://YOUR-APP.vercel.app
ADMIN_EMAIL=admin@hellodoctor.com
ADMIN_PASSWORD=change-this-to-strong-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://hellodoctor-backend.onrender.com`)

---

## 3️⃣ Update Frontend Config (1 minute)

1. Open `my-react-app/.env.production`
2. Replace with your Render URL:
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```
3. Save, commit, and push:
```bash
git add .
git commit -m "Update backend URL"
git push
```

---

## 4️⃣ Deploy Frontend on Vercel (3 minutes)

1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import `HelloDoctor` repo
4. **Configuration:**
   - Framework: Vite
   - Root Directory: `my-react-app`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variable:**
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

6. Click "Deploy"
7. **Copy your frontend URL** (e.g., `https://hellodoctor.vercel.app`)

---

## 5️⃣ Update Backend with Frontend URL (1 minute)

1. Go back to Render dashboard
2. Open `hellodoctor-backend` service
3. Go to "Environment" tab
4. Update `FRONTEND_URL`:
```
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
```
5. Save (will auto-redeploy)

---

## ✅ Test Your Deployment

1. Backend Health: `https://YOUR-BACKEND.onrender.com/api/health`
2. Frontend: `https://YOUR-FRONTEND.vercel.app`

---

## ⚠️ Important Notes

### First Load Warning
- Render free tier spins down after 15 min of inactivity
- First request after sleep takes 30-60 seconds
- Subsequent requests are fast

### File Uploads Issue
- Current local file storage won't work on Render
- **Solution**: Use Cloudinary (sign up at cloudinary.com)
- Add these to Render environment:
```
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### MongoDB Access
- Make sure MongoDB Atlas Network Access allows: `0.0.0.0/0`
- Go to: Atlas Dashboard → Network Access → Add IP Address → Allow Access from Anywhere

---

## 🎉 Done!

Your app is now live:
- Frontend: https://YOUR-APP.vercel.app
- Backend: https://YOUR-BACKEND.onrender.com

Any push to `main` branch auto-deploys both services!

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
