# Comprehensive Wix AI Prompt for Smart Crowd Management System - Mahakumbh 2028

## Project Overview
Create a comprehensive **Smart Crowd Management Prototype Website for Mahakumbh 2028** - a spiritual gathering management system with AI-powered crowd analytics, dynamic routing, and real-time monitoring capabilities.

## Core System Architecture

### Frontend Requirements (Wix Implementation)
- **Landing Page**: Professional landing page explaining "Smart Crowd Management Solution for Mahakumbh 2028" with hero section, features overview, and call-to-action
- **Dual Authentication System**: 
  - Pilgrim login via Aadhaar card number validation
  - Authority login with admin credentials
- **Responsive Design**: Mobile-first design with saffron/orange spiritual theme, ensuring accessibility across all devices

### Pilgrim Portal Features
1. **Aadhaar-Based Registration**: 
   - Primary authentication through 12-digit Aadhaar number
   - Automatic validation and verification system
   - Mobile number linking for SMS alerts

2. **Group Booking System**:
   - Single QR code generation for up to 10 people maximum
   - Main applicant must provide all group members' Aadhaar numbers
   - Automatic bank account linking through Aadhaar for payment processing
   - Dynamic pricing based on real-time crowd density

3. **Digital Pass Generation**:
   - QR code creation with embedded pilgrim data, group size, and validity
   - Exit deadline assignment upon registration (24-48 hour slots)
   - Downloadable/printable pass with emergency contact information
   - RFID backup system for offline scenarios

4. **Smart Features**:
   - Real-time route suggestions based on crowd density
   - Dynamic pricing alerts (surge pricing during peak times)
   - Extension options for tent city accommodation (additional charges)
   - Penalty notification system via SMS and web portal

### Authority Dashboard Features
1. **Live Monitoring System**:
   - Real-time crowd density heatmap with color-coded risk levels
   - Zone-wise capacity tracking with percentage utilization
   - Entry/exit flow monitoring with trend analysis
   - IoT sensor status and health monitoring

2. **AI-Powered Predictions**:
   - Machine learning algorithms for crowd flow prediction
   - Bottleneck identification and early warning system
   - Safety risk assessment based on historical data
   - Demand forecasting for resource allocation

3. **Advanced Analytics**:
   - Power BI integrated dashboard for comprehensive analytics
   - YOLO v8n computer vision for people counting via cameras
   - Real-time data streaming from IoT sensors (people counters, RFID readers, thermal cameras)
   - Predictive alerts with confidence scores and recommended actions

### Backend System Requirements
1. **Database Schema**:
   - **Users Collection**: { aadhaar, name, mobile, role, bank_account, group_members }
   - **Passes Collection**: { pass_id, user_id, group_size, zone_assignment, entry_time, exit_deadline, status, qr_code }
   - **Penalties Collection**: { penalty_id, user_id, amount, reason, auto_deduction_status, sms_sent }
   - **Crowd_Data Collection**: { zone_id, density, timestamp, sensor_readings, predictions }
   - **IoT_Sensors Collection**: { sensor_id, type, location, status, last_reading, battery_level }

2. **API Endpoints**:
   - `/api/auth/aadhaar-login` - Aadhaar-based authentication
   - `/api/passes/generate` - QR code pass generation for groups
   - `/api/crowd/live-data` - Real-time crowd density data
   - `/api/predictions/alerts` - AI-generated crowd predictions
   - `/api/penalties/calculate` - Automatic penalty calculation
   - `/api/sms/send-alert` - Multi-language SMS notifications
   - `/api/iot/sensor-data` - IoT sensor data streaming

### Advanced AI & ML Features
1. **Crowd Flow Algorithms**:
   - Predictive density modeling using historical patterns
   - Real-time bottleneck detection and prevention
   - Dynamic route optimization based on current conditions
   - Safety risk scoring with automated response triggers

2. **YOLO v8n Computer Vision**:
   - Live people counting in buffer zones
   - Object detection for security monitoring
   - Crowd behavior analysis and anomaly detection
   - Integration with existing camera infrastructure

3. **Smart Routing System**:
   - Multi-path route suggestions with estimated times
   - Dynamic pricing based on demand and capacity
   - Alternative route recommendations during congestion
   - Real-time updates via mobile notifications

### IoT Integration Requirements
1. **Sensor Network**:
   - People counters at entry/exit points
   - RFID readers for offline pass verification
   - QR scanners for digital pass processing
   - Thermal cameras for crowd density mapping
   - Sound level monitors for safety assessment

2. **Real-time Data Pipeline**:
   - Live data streaming every 2-5 seconds
   - Edge computing for immediate processing
   - Cloud synchronization for backup and analytics
   - Automatic failover systems for sensor maintenance

### Penalty & Payment System
1. **Automatic Penalty Calculation**:
   - Grace period: 2-4 hours after exit deadline
   - Penalty structure: ₹500 for first 2 hours, ₹200 per additional hour
   - Maximum penalty cap: ₹2000 per group
   - Automatic bank account deduction through Aadhaar linkage

2. **Extension Services**:
   - Tent city booking with dynamic pricing (₹300-800 per night)
   - Extended stay permits with additional verification
   - Premium services with expedited processing
   - Family packages with group discounts

### Multi-language Support
1. **Primary Languages**: English and Hindi with toggle functionality
2. **SMS Templates**: Pre-defined messages in multiple regional languages
3. **IVR System**: Voice alerts in Hindi, English, and regional languages
4. **Emergency Announcements**: Multi-language broadcast capability

### Security & Compliance Features
1. **Fraud Detection System**:
   - Real-time duplicate Aadhaar detection
   - Cross-verification with government databases
   - Suspicious activity monitoring and flagging
   - Automated blocking of fraudulent passes

2. **Data Privacy Compliance**:
   - Government IT standards adherence
   - Encrypted data storage and transmission
   - Audit trails for all transactions
   - GDPR-style privacy controls

3. **Authentication Security**:
   - JWT-based session management
   - Multi-factor authentication for authorities
   - Role-based access control (RBAC)
   - API rate limiting and DDoS protection

### Power BI Analytics Dashboard
1. **Key Performance Indicators**:
   - Total pilgrim count with hourly/daily trends
   - Zone utilization rates and capacity planning
   - AI prediction accuracy and model performance
   - Revenue from penalties and extensions

2. **Advanced Visualizations**:
   - Interactive crowd density heatmaps
   - Real-time flow charts and trend analysis
   - Predictive modeling charts with confidence intervals
   - Comparative analysis with previous events

### Technical Implementation on Wix
1. **Wix Velo Backend**: 
   - Custom JavaScript functions for API integrations
   - Database collections for user data and analytics
   - Scheduled jobs for automated penalty processing
   - External API connections for Aadhaar verification

2. **Frontend Components**:
   - Custom interactive heatmap using Wix animations
   - Dynamic forms with real-time validation
   - QR code generation using external libraries
   - Responsive dashboard with mobile optimization

3. **Third-party Integrations**:
   - SMS gateway for multilingual notifications
   - Payment gateway for penalty collection
   - Map services for location-based features
   - Analytics tools for user behavior tracking

### Deployment & Scalability
1. **Performance Requirements**:
   - Support for 100,000+ concurrent users
   - Sub-second response times for critical operations
   - 99.9% uptime during event periods
   - Automatic scaling based on traffic patterns

2. **Monitoring & Maintenance**:
   - Real-time system health monitoring
   - Automated error reporting and alerts
   - Performance analytics and optimization
   - Backup and disaster recovery procedures

## Sample User Journeys

### Pilgrim Journey:
1. **Registration**: Enter Aadhaar → Add group members → Receive SMS verification
2. **Pass Generation**: Select time slot → Complete payment → Download QR pass
3. **Entry**: Scan QR at gate → Receive exit deadline notification
4. **Monitoring**: Track time remaining → Receive extension options
5. **Exit/Penalty**: Exit on time OR receive penalty notification → Auto-payment deduction

### Authority Journey:
1. **Dashboard Access**: Login with admin credentials → View real-time statistics
2. **Monitoring**: Check crowd density → Review AI predictions → Manage alerts
3. **Response**: Implement crowd control measures → Update system status → Monitor effectiveness
4. **Analytics**: Generate reports → Analyze trends → Plan resource allocation

This comprehensive system combines modern web development with AI-powered analytics, IoT integration, and government-grade security to create a scalable, efficient crowd management solution for large-scale religious gatherings.