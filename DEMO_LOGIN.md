# 🚀 DEMO LOGIN INSTRUCTIONS

## ❗ IMPORTANT: Use These Exact Aadhaar Numbers

The system only accepts these **5 pre-configured demo accounts**:

### 👥 **PILGRIM ACCOUNTS**
- **Ram Kumar**: `123456789012` 
- **Sita Devi**: `123456789013`
- **Priya Sharma**: `123456789016`

### 🛡️ **AUTHORITY ACCOUNTS** (with YOLO v8 AI)
- **Admin Officer**: `123456789014`
- **Crowd Manager**: `123456789015`

## 📝 **How to Login**

### Method 1: Quick Auto-Fill (Recommended)
1. Go to **http://localhost:8080**
2. Click on one of the **demo login buttons** at the bottom
3. Click **Sign In**

### Method 2: Manual Entry
1. **Full Name**: Enter any name (or use the suggested names above)
2. **Aadhaar Number**: Enter one of the 5 numbers above **exactly**
   - Format: `1234 5678 9012` (spaces are auto-added)
   - Must be exactly 12 digits
3. **Select Role**: Choose Pilgrim or Authority
4. Click **Sign In**

## ⚠️ **Common Issues & Solutions**

### ❌ "Invalid Aadhaar" Error
**Problem**: You're entering a wrong Aadhaar number
**Solution**: Use **only** these 5 numbers:
- `123456789012` - Ram Kumar
- `123456789013` - Sita Devi  
- `123456789014` - Admin Officer ⭐ **FOR YOLO AI**
- `123456789015` - Crowd Manager ⭐ **FOR YOLO AI**
- `123456789016` - Priya Sharma

### ❌ Login But Can't Access Dashboard
**Problem**: Authentication works but page doesn't load
**Solution**: Check browser console (F12) for errors

### ❌ YOLO Not Working
**Problem**: Authority dashboard shows "Connection failed"
**Solution**: 
1. Make sure your Google Colab YOLO service is running
2. Ngrok tunnel should be: `https://37dbb1d0ba0e.ngrok-free.app`
3. If different, update the URL in code

## 🎯 **What You'll See After Login**

### 🙏 **Pilgrim Portal Features**:
- Book passes for sacred zones
- Manage group bookings (up to 10 people)
- Generate QR codes
- Track penalties
- Bilingual interface (English/Hindi)

### 📊 **Authority Dashboard Features**:
- **🤖 YOLO v8 AI Crowd Detection** (at the top)
  - Real-time people counting
  - Left/right distribution analysis
  - Live video feed processing
- Real-time crowd monitoring for all zones
- System alerts and predictions
- Zone capacity tracking
- IoT sensor status

## 🔧 **Technical Details**

- **Frontend**: React + TypeScript + Vite
- **Authentication**: Mock service (no actual backend needed)
- **Database**: SQLite with Prisma (seeded with demo data)
- **YOLO Integration**: Google Colab + ngrok tunnel
- **UI**: shadcn/ui components with Tailwind CSS

## 🆘 **Still Not Working?**

1. **Check Console**: Press F12, look for red errors
2. **Clear Cache**: Ctrl+F5 to hard refresh
3. **Check Network**: Make sure you're on http://localhost:8080
4. **Restart**: Stop server (Ctrl+C) and run `npm run dev` again

## ✅ **Success Checklist**

- [ ] Application running on http://localhost:8080
- [ ] Used one of the 5 demo Aadhaar numbers
- [ ] Selected correct role (Pilgrim/Authority)
- [ ] Successfully redirected to appropriate dashboard
- [ ] (Authority only) YOLO AI section appears at top of dashboard

---

**🎉 Ready to test? Use Admin Officer (123456789014) to see the YOLO v8 AI in action!**
