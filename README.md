# 🕉️ Kumbha Suraksha Flow - Smart Crowd Management System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

**A comprehensive Smart Crowd Management System for Mahakumbh 2028** - Revolutionizing spiritual gathering management with AI-powered crowd analytics, real-time monitoring, and intelligent routing.

![Mahakumbh Hero](src/assets/mahakumbh-hero.jpg)

## 🌟 Features

### 🤖 **AI-Powered Crowd Detection**
- **YOLO v8 Integration**: Real-time people counting using computer vision
- **Left/Right Distribution Analysis**: Advanced crowd flow analytics
- **Live Video Processing**: Connects to Google Colab via ngrok tunnel
- **Predictive Analytics**: AI-based crowd flow forecasting

### 👥 **Dual Portal System**

#### 🙏 **Pilgrim Portal**
- **Aadhaar-Based Authentication**: Secure 12-digit Aadhaar verification
- **Group Booking**: Single QR code for up to 10 people
- **Dynamic Pricing**: Real-time pricing based on crowd density
- **Digital Passes**: QR code generation with exit deadlines
- **Penalty Tracking**: Automated penalty calculation and SMS alerts
- **Bilingual Support**: English/Hindi interface

#### 🛡️ **Authority Dashboard**
- **Real-Time Monitoring**: Live crowd density across all zones
- **YOLO AI Integration**: Computer vision crowd detection
- **Zone Management**: Capacity tracking with color-coded risk levels
- **Alert System**: AI-generated predictions and warnings
- **IoT Sensor Dashboard**: Real-time sensor status and readings
- **Power BI Analytics**: Advanced data visualization

### 🏛️ **Sacred Zone Management**
- **Sangam Ghat**: Main confluence area (15,000 capacity)
- **Akshaya Vat**: Sacred Banyan tree area (10,000 capacity)
- **Hanuman Temple**: Historic temple complex (8,000 capacity)
- **Patalpuri Temple**: Underground temple (5,000 capacity)
- **Saraswati Koop**: Sacred well area (10,000 capacity)
  
# Smart Crowd Management Solution

![Landing Page](src/assets/Screenshot-2025-09-09-180928.png)
*Main landing page: Welcomes pilgrims and explains the core solution.*

## Key Features

**Pilgrim Login**
![Login Screen](src/assets/Screenshot-2025-09-09-180848.png)
*Secure Aadhaar-based login for attendees.*

**Group Pass Management**
![Group Booking](src/assets/Screenshot-2025-09-09-181126.png)
*Book passes for groups and manage family members easily.*

## Authority Dashboard

**Dashboard Overview**
![Dashboard Overview](src/assets/Screenshot-2025-09-09-181553.png)

**Live Crowd Monitoring and Alerts**
![Live Crowd Monitoring and Alerts](src/assets/Screenshot-2025-09-09-181242.png)


## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kumbha-suraksha-flow.git
cd kumbha-suraksha-flow

# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

🎉 **Application will be available at**: http://localhost:8080

## 🔐 Demo Accounts

### 🛡️ **Authority Accounts** (Access YOLO AI Dashboard)
- **Admin Officer**: `123456789014`
- **Crowd Manager**: `123456789015`

### 👥 **Pilgrim Accounts**
- **Ram Kumar**: `123456789012`
- **Sita Devi**: `123456789013`
- **Priya Sharma**: `123456789016`

### 📝 **How to Login**
1. Go to http://localhost:8080
2. Click one of the **Quick Demo Login** buttons
3. Or manually enter Aadhaar + Name + Role
4. Click **Sign In**

## 🤖 YOLO v8 AI Integration

### Setup Computer Vision Service

1. **Google Colab Setup**:
```python
# Install required libraries
!pip install ultralytics flask pyngrok

# Set ngrok auth token
ngrok.set_auth_token("your_token_here")

# Load YOLO model
model = YOLO('yolov8x.pt')

# Start Flask API with ngrok tunnel
# Creates public URL: https://xxxxx.ngrok-free.app
```

2. **Frontend Integration**:
- Automatic connection to ngrok tunnel
- Real-time polling every 5 seconds
- Fallback to mock data if service unavailable
- Connection testing and status monitoring

3. **API Response Format**:
```json
{
  "left_count": 25,
  "right_count": 18,
  "total_count": 43,
  "more_people_side": "left"
}
```

## 🏗️ Tech Stack

### **Frontend**
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Power BI**: interactive dashboard

### **Backend & Database**
- **Prisma**: Type-safe database ORM
- **SQLite**: Lightweight database
- **Mock Services**: Frontend-ready authentication

### **Styling & UI**
- **Custom Spiritual Theme**: Saffron/orange color scheme
- **Responsive Design**: Mobile-first approach
- **Lucide Icons**: Modern icon library
- **Custom Animations**: Smooth transitions

## 📊 Database Schema

### Core Models
```prisma
model User {
  id          String   @id @default(uuid())
  aadhaar     String   @unique
  name        String
  role        String   @default("pilgrim")
  isVerified  Boolean  @default(false)
  passes      Pass[]
  penalties   Penalty[]
}

model Zone {
  name        String   @unique
  maxCapacity Int
  crowdData   CrowdData[]
  iotSensors  IoTSensor[]
}

model Pass {
  qrCode      String   @unique
  groupSize   Int      @default(1)
  exitDeadline DateTime
  status      String   @default("active")
  groupMembers GroupMember[]
}
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Aadhaar-based login
- `POST /api/auth/logout` - User logout

### Pass Management
- `GET /api/passes/user/:id` - Get user passes
- `POST /api/passes/generate` - Generate new pass
- `PUT /api/passes/:id/entry` - Mark pass entry

### Crowd Data
- `GET /api/crowd/live` - Real-time crowd data
- `GET /api/crowd/zones` - All zones with capacity
- `GET /api/yolo/counts` - YOLO crowd counts

### Analytics
- `GET /api/analytics/dashboard` - Authority dashboard data
- `GET /api/alerts/active` - Active system alerts

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed with demo data
npm run db:reset         # Reset and reseed

# Code Quality
npm run lint             # ESLint check
npm run type-check       # TypeScript check
```

## 🏛️ Project Structure

```
kumbha-suraksha-flow/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 ui/              # shadcn/ui components
│   │   ├── 📁 Layout/          # Layout components
│   │   └── YoloCrowdDetection.tsx
│   ├── 📁 pages/              # Page components
│   │   ├── AuthorityDashboard.tsx
│   │   ├── PilgrimPortal.tsx
│   │   └── LoginPage.tsx
│   ├── 📁 services/           # Business logic
│   │   ├── 📁 database/       # Database services
│   │   ├── yoloService.ts     # YOLO integration
│   │   └── mockData.ts        # Mock services
│   ├── 📁 contexts/           # React contexts
│   └── 📁 utils/              # Utility functions
├── 📁 prisma/                 # Database schema
├── 📁 public/                 # Static assets
└── 📋 Configuration files
```

## 🎯 Key Features Walkthrough

### 1. **Smart Authentication**
- Aadhaar-based verification
- Role-based access control
- Persistent sessions with localStorage

### 2. **Intelligent Group Booking**
- Single QR for multiple pilgrims
- Dynamic pricing engine
- Automated penalty calculation

### 3. **Real-Time Crowd Analytics**
- Live IoT sensor integration
- YOLO v8 computer vision
- Predictive crowd flow modeling

### 4. **Authority Command Center**
- Comprehensive dashboard
- Alert management system
- Zone capacity monitoring

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
YOLO_NGROK_URL="https://your-ngrok-url.ngrok-free.app"
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices
- Maintain responsive design
- Add proper error handling
- Include comprehensive logging

## 📋 Testing

### Demo Testing Checklist
- [ ] Login with authority account (123456789014)
- [ ] Verify YOLO AI section appears
- [ ] Test crowd detection (if ngrok service running)
- [ ] Login with pilgrim account (123456789012)
- [ ] Book a group pass
- [ ] Generate QR code
- [ ] Test penalty calculation

### Browser Console Debugging
```javascript
// Check available users
debugAuth.getAllUsers()

// Test authentication
debugAuth.testAuth('123456789014')

// Check stored user
JSON.parse(localStorage.getItem('user'))

// Debug page
// Go to: http://localhost:8080/debug
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Invalid Aadhaar" Error
- **Solution**: Use exact demo Aadhaar numbers listed above
- **Check**: Console logs for authentication flow

#### ❌ Authority Login Shows Pilgrim Portal
- **Solution**: Check browser console for routing logs
- **Debug**: Visit `/debug` page to verify user role

#### ❌ YOLO Service Not Connecting
- **Solution**: Verify Google Colab service is running
- **Check**: ngrok tunnel URL matches configuration
- **Fallback**: System shows mock data automatically

#### ❌ Database Errors
```bash
npm run db:reset  # Reset database
npm run db:seed   # Reseed with demo data
```

## 📊 Performance

### Metrics
- **Bundle Size**: ~451KB (gzipped: ~141KB)
- **Load Time**: <2 seconds
- **Lighthouse Score**: 95+ across all categories
- **Concurrent Users**: Designed for 100,000+

### Optimization
- Code splitting with Vite
- Image optimization
- Lazy loading components
- Efficient state management

## 📚 Documentation

- **[WARP.md](WARP.md)**: Comprehensive development guide
- **[LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md)**: Authentication reference
- **[DEMO_LOGIN.md](DEMO_LOGIN.md)**: Quick start guide
- **API Documentation**: Coming soon

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mahakumbh 2028**: Inspiration for crowd management innovation
- **YOLO v8**: Advanced computer vision capabilities
- **shadcn/ui**: Beautiful UI component library
- **Prisma**: Excellent database tooling
- **Vite**: Amazing development experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/kumbha-suraksha-flow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/kumbha-suraksha-flow/discussions)
- **Email**: dhruvtiwari231178@acropolis.in

---

<div align="center">

**🕉️ Built with devotion for Mahakumbh 2028 🕉️**

*Transforming spiritual gatherings through technology*

[⭐ Star this repo](https://github.com/yourusername/kumbha-suraksha-flow) | [🐛 Report Bug](https://github.com/yourusername/kumbha-suraksha-flow/issues) | [💡 Request Feature](https://github.com/yourusername/kumbha-suraksha-flow/issues)

</div>
