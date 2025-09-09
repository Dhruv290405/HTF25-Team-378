# Login Credentials for Kumbha Suraksha Flow

## Authority Dashboard Login
Use these Aadhaar numbers to access the Authority Dashboard:

- **Admin Officer**: `123456789014`
  - Name: Admin Officer
  - Email: admin@mahakumbh.gov.in
  - Role: authority

- **Crowd Manager**: `123456789015`
  - Name: Crowd Manager
  - Email: crowd@mahakumbh.gov.in
  - Role: authority

## Pilgrim Portal Login
Use these Aadhaar numbers to access the Pilgrim Portal:

- **Ram Kumar**: `123456789012`
  - Name: Ram Kumar
  - Email: ram.kumar@example.com
  - Role: pilgrim

- **Sita Devi**: `123456789013`
  - Name: Sita Devi
  - Email: sita.devi@example.com
  - Role: pilgrim

- **Priya Sharma**: `123456789016`
  - Name: Priya Sharma
  - Email: priya.sharma@example.com
  - Role: pilgrim

## Quick Start

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Open http://localhost:8081 (or the port shown in terminal)

3. **Login Process**:
   - Click "Login" 
   - Enter one of the Aadhaar numbers above
   - You'll be redirected based on your role:
     - Authority users → Authority Dashboard (with YOLO integration)
     - Pilgrim users → Pilgrim Portal

4. **YOLO Integration**:
   - Authority Dashboard shows real-time YOLO v8 crowd detection
   - Connects to: https://37dbb1d0ba0e.ngrok-free.app/get_counts
   - If YOLO service is unavailable, shows mock data

## Features to Test

### Authority Dashboard
- ✅ Real-time crowd monitoring
- ✅ YOLO v8 AI crowd detection
- ✅ System alerts
- ✅ Live data updates every 10 seconds
- ✅ Zone capacity tracking

### Pilgrim Portal
- ✅ Pass booking and management
- ✅ Group member management
- ✅ QR code generation
- ✅ Penalty tracking
- ✅ Bilingual interface (English/Hindi)

## Database Status
- ✅ Database seeded with test data
- ✅ 5 zones created (Sangam Ghat, Akshaya Vat, etc.)
- ✅ 5 users created (3 pilgrims, 2 authorities)
- ✅ IoT sensors configured
- ✅ Historical crowd data generated
