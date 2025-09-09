# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Kumbha Suraksha Flow** - a comprehensive Smart Crowd Management System prototype for Mahakumbh 2028. It's a spiritual gathering management system with AI-powered crowd analytics, dynamic routing, and real-time monitoring capabilities built with React/TypeScript, Prisma, and SQLite.

## Core Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom spiritual theme (saffron/orange colors)
- **Database**: SQLite with Prisma ORM
- **State Management**: React Query (TanStack Query) + Context API
- **Routing**: React Router DOM

### Application Structure
The system has **dual authentication flows**:
1. **Pilgrim Portal**: Aadhaar-based authentication for pilgrims to book passes, manage groups, and track penalties
2. **Authority Dashboard**: Admin interface for real-time crowd monitoring, AI predictions, and system management

### Key Domain Models
- **Users**: Aadhaar-based authentication with roles (pilgrim, authority, admin)
- **Zones**: Physical areas with capacity limits (Sangam Ghat, Akshaya Vat, etc.)
- **Passes**: Group bookings with QR codes, exit deadlines, and penalty tracking
- **CrowdData**: Real-time density monitoring with IoT sensor integration
- **Alerts**: AI-generated warnings for capacity, emergency, fraud, and system issues

## Development Commands

### Essential Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Database Management
```bash
# Generate Prisma client (run after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Seed database with test data
npm run db:seed

# Reset database and reseed
npm run db:reset
```

### Running Tests
Currently no test setup exists. Consider adding:
- Unit tests with Jest/Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

## Key Service Layer Architecture

### Database Services (src/services/database/)
- **userService.ts**: User management, Aadhaar validation, role-based access
- **passService.ts**: Pass generation, QR codes, group booking logic
- **crowdService.ts**: Zone management, crowd density tracking, IoT sensor data
- **notificationService.ts**: SMS/email alerts, penalty management, audit logging

### AI & Analytics Services (src/services/)
- **aiPredictionService.ts**: Crowd flow predictions using historical patterns
- **crowdFlowAlgorithm.ts**: Dynamic routing and bottleneck detection
- **fraudDetection.ts**: Duplicate Aadhaar and suspicious activity monitoring
- **iotSensorService.ts**: Real-time sensor data processing
- **cameraService.ts**: YOLO v8n computer vision integration (placeholder)
- **yoloService.ts**: Real-time YOLO v8 crowd counting via ngrok tunnel integration

## Important Implementation Details

### Authentication System
- Primary auth via 12-digit Aadhaar number validation
- Context-based authentication state management
- Role-based routing (pilgrim vs authority dashboards)
- localStorage persistence for user sessions

### Group Booking Logic
- Maximum 10 people per group booking
- Single QR code for entire group
- Main applicant provides all group members' Aadhaar numbers
- Dynamic pricing based on crowd density and tent city accommodation

### Real-time Data Flow
The system simulates real-time crowd monitoring through:
- Mock IoT sensor readings every 10 seconds
- Dynamic crowd density calculations with color-coded risk levels
- AI prediction algorithms based on historical patterns
- Automatic alert generation for critical capacity thresholds

### Penalty System
- Automatic penalty calculation after exit deadline
- Grace period: 2-4 hours with escalating fees (₹500 + ₹200/hour, max ₹2000)
- Bank account integration through Aadhaar linkage (simulated)
- Multi-language SMS notifications

## Database Schema Key Relationships

- **Users** → **Passes** (one-to-many): User can have multiple passes
- **Passes** → **GroupMembers** (one-to-many): Each pass contains group member details
- **Zones** → **CrowdData** (one-to-many): Historical density tracking per zone
- **Zones** → **IoTSensors** (one-to-many): Multiple sensors per zone
- **Users** → **Penalties** (one-to-many): Penalty tracking per user

## Localization

The system supports **bilingual interface** (English/Hindi):
- Translation utilities in `src/utils/translations.ts`
- Language toggle in AuthContext
- SMS templates in multiple regional languages
- Spiritual/cultural appropriate terminology

## Mock Data vs Real Implementation

Currently uses mock data services with:
- Simulated IoT sensor readings
- Generated crowd density variations
- Mock SMS/payment gateways
- Placeholder AI prediction algorithms

For production deployment, replace mock services with:
- Real IoT sensor API integration
- Government Aadhaar verification API
- Actual SMS gateway services
- Bank payment integration APIs
- YOLO v8n computer vision implementation

## Development Tips

### File Path Conventions
- Use `@/` alias for all src imports
- Component files use PascalCase
- Service files use camelCase
- Database models match Prisma schema naming

### Component Architecture
- Pages in `src/pages/` for route components
- Reusable UI components in `src/components/ui/` (shadcn/ui)
- Business logic components in `src/components/`
- Context providers for global state management

### Styling Guidelines
- Primary colors use saffron/orange spiritual theme
- Responsive design with mobile-first approach
- Custom CSS variables in `src/index.css`
- Tailwind utility classes for component styling

## Critical Business Logic

### Crowd Flow Management
The system implements sophisticated crowd management through:
- Zone capacity monitoring with 90% critical threshold
- Dynamic routing suggestions based on real-time density
- Predictive bottleneck identification
- Emergency alert systems with automated responses

### Pass Management Workflow
1. Aadhaar validation → Group member registration → Zone selection
2. Dynamic pricing calculation → QR code generation → Exit deadline assignment
3. Real-time entry tracking → Extension options → Penalty enforcement

### AI Prediction Engine
- Historical pattern analysis for crowd flow forecasting
- Machine learning models for demand prediction
- Safety risk assessment with confidence scores
- Automated resource allocation recommendations

This system is designed for handling 100,000+ concurrent users during major religious gatherings with 99.9% uptime requirements.

## YOLO v8 Integration

The system now includes **real-time AI crowd detection** using YOLO v8 computer vision:

### Setup
1. **Google Colab YOLO Service**: Run the provided Python script in Google Colab
2. **Ngrok Tunnel**: The service creates a public API at `https://37dbb1d0ba0e.ngrok-free.app/get_counts`
3. **React Integration**: `YoloCrowdDetection` component displays live crowd counts

### Features
- **Real-time People Counting**: Left/right side distribution analysis
- **Computer Vision**: YOLO v8x model for accurate person detection
- **Live Dashboard**: Updates every 5 seconds with crowd density
- **Fallback System**: Shows mock data if YOLO service is unavailable
- **Connection Testing**: Built-in connectivity validation

### API Response Format
```json
{
  "left_count": 25,
  "right_count": 18,
  "total_count": 43,
  "more_people_side": "left"
}
```

### Usage
- Authority Dashboard automatically displays YOLO data at the top
- Service polls every 5 seconds for live updates
- Manual refresh and connection testing available
- Graceful degradation to mock data if service unavailable
