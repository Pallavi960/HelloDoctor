# 🏥 HelloDoctor - Doctor Appointment System

A full-stack MERN application for managing doctor appointments with separate dashboards for patients, doctors, and administrators.

## 🚀 Quick Start for Deployment

**Your project is now ready for deployment!**

👉 **Follow the simple guide**: [QUICK_START.md](./QUICK_START.md) (~15 minutes)

📚 **Detailed instructions**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📦 What's Been Configured

### ✅ Deployment Files Created:
- `backend/render.yaml` - Render configuration for backend
- `my-react-app/vercel.json` - Vercel configuration for frontend
- `.gitignore` - Proper git ignore rules
- `.env.production` files - Production environment templates

### ✅ Database Configured:
- MongoDB Atlas: `HelloDoctor` database
- Connection string already set up

### ✅ Project Structure:
```
HelloDoctor/
├── backend/                 # Express.js API
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Auth & upload middleware
│   └── render.yaml        # 🆕 Render deployment config
│
├── my-react-app/          # React frontend
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── component/    # React components
│   │   └── config/       # API configuration
│   └── vercel.json       # 🆕 Vercel deployment config
│
├── QUICK_START.md        # 🆕 Fast deployment guide
└── DEPLOYMENT_GUIDE.md   # 🆕 Detailed deployment guide
```

---

## 🎯 Deployment Steps Overview

1. **Push to GitHub** (5 min)
2. **Deploy Backend to Render** (5 min)
3. **Update Frontend Config** (1 min)
4. **Deploy Frontend to Vercel** (3 min)
5. **Update Backend with Frontend URL** (1 min)

**Total Time**: ~15 minutes

---

## 🌐 Deployment Platforms

### Frontend: Vercel
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Global CDN
- ✅ Custom domains supported

### Backend: Render
- ✅ Free tier available (with sleep after 15min inactivity)
- ✅ Automatic deployments from GitHub
- ✅ Environment variable management
- ⚠️ First load after sleep: 30-60 seconds

### Database: MongoDB Atlas
- ✅ Already configured
- ✅ Database name: `HelloDoctor`
- ✅ Connection ready

---

## ⚙️ Local Development

### Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local settings
npm start
```

### Frontend Setup:
```bash
cd my-react-app
npm install
npm run dev
```

Access at: http://localhost:5173

---

## 🔐 Environment Variables

### Backend (.env):
```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env):
```env
VITE_API_URL=http://localhost:8000
```

---

## 📋 Features

- 👥 **User Management**: Patient registration and authentication
- 👨‍⚕️ **Doctor Portal**: Doctor profiles, availability, appointments
- 📅 **Appointment Booking**: Real-time slot management
- 🔔 **Notifications**: Email and in-app notifications
- 👨‍💼 **Admin Dashboard**: User and doctor management
- 📊 **Reports**: Analytics and feedback system
- 📝 **Feedback System**: Patient reviews and ratings

---

## 🛠️ Tech Stack

### Frontend:
- React 19
- React Router DOM
- Tailwind CSS
- Vite
- Recharts (Analytics)
- Lucide React (Icons)

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt (Password hashing)
- Nodemailer (Emails)
- Multer (File uploads)
- Cloudinary (Image storage)

---

## 📝 Important Notes

### File Uploads:
Current setup uses local storage. For production, you need:
- **Option 1**: Configure Cloudinary (recommended - already in dependencies)
- **Option 2**: Use Render persistent disk (paid plan)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for setup instructions.

### Free Tier Limitations:
- Render backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Subsequent requests are fast

### MongoDB Atlas:
Ensure Network Access allows:
- Development: Your IP
- Production: `0.0.0.0/0` (all IPs)

---

## 🚨 Before You Deploy

1. [ ] Push code to GitHub
2. [ ] Change default admin password
3. [ ] Generate strong JWT_SECRET (32+ characters)
4. [ ] Set up Gmail App Password for email service
5. [ ] Configure Cloudinary for file uploads
6. [ ] Verify MongoDB Atlas network access

---

## 📖 Documentation

- [Quick Start Guide](./QUICK_START.md) - Fast deployment in 15 minutes
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detailed step-by-step instructions

---

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review logs in Render/Vercel dashboard
3. Verify environment variables
4. Check MongoDB Atlas connection

---

## 📄 License

[Your License Here]

---

## 👨‍💻 Author

[Your Name/Organization]

---

**Ready to deploy?** Start here: [QUICK_START.md](./QUICK_START.md) 🚀
