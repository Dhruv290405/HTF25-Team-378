import prisma from '../lib/database';
import { UserService } from '../services/database/userService';
import { PassService } from '../services/database/passService';
import { CrowdService } from '../services/database/crowdService';
import { NotificationService, PenaltyService, AuditService } from '../services/database/notificationService';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (in correct order to handle foreign keys)
    console.log('🧹 Cleaning existing data...');
    await prisma.sensorReading.deleteMany({});
    await prisma.ioTSensor.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.penalty.deleteMany({});
    await prisma.groupMember.deleteMany({});
    await prisma.alert.deleteMany({});
    await prisma.crowdData.deleteMany({});
    await prisma.pass.deleteMany({});
    await prisma.zone.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.systemSetting.deleteMany({});
    await prisma.analytics.deleteMany({});

    // Create zones
    console.log('🏛️ Creating zones...');
    const zones = await Promise.all([
      CrowdService.createZone({
        name: 'Sangam Ghat',
        maxCapacity: 15000,
        location: 'Main Confluence Area',
        description: 'Primary bathing area at the confluence of three rivers'
      }),
      CrowdService.createZone({
        name: 'Akshaya Vat',
        maxCapacity: 10000,
        location: 'Central Allahabad',
        description: 'Sacred Banyan tree area'
      }),
      CrowdService.createZone({
        name: 'Hanuman Temple',
        maxCapacity: 8000,
        location: 'Temple Complex',
        description: 'Historic Hanuman temple and surrounding area'
      }),
      CrowdService.createZone({
        name: 'Patalpuri Temple',
        maxCapacity: 5000,
        location: 'Underground Temple',
        description: 'Ancient underground temple complex'
      }),
      CrowdService.createZone({
        name: 'Saraswati Koop',
        maxCapacity: 10000,
        location: 'Sacred Well Area',
        description: 'Mythical Saraswati river confluence point'
      })
    ]);

    // Create users
    console.log('👥 Creating users...');
    const users = await Promise.all([
      UserService.createUser({
        aadhaar: '123456789012',
        name: 'Ram Kumar',
        mobile: '9876543210',
        email: 'ram.kumar@example.com',
        role: 'pilgrim',
        bankAccount: 'ACC123456789'
      }),
      UserService.createUser({
        aadhaar: '123456789013',
        name: 'Sita Devi',
        mobile: '9876543211',
        email: 'sita.devi@example.com',
        role: 'pilgrim',
        bankAccount: 'ACC123456790'
      }),
      UserService.createUser({
        aadhaar: '123456789014',
        name: 'Admin Officer',
        mobile: '9876543212',
        email: 'admin@mahakumbh.gov.in',
        role: 'authority'
      }),
      UserService.createUser({
        aadhaar: '123456789015',
        name: 'Crowd Manager',
        mobile: '9876543213',
        email: 'crowd@mahakumbh.gov.in',
        role: 'authority'
      }),
      UserService.createUser({
        aadhaar: '123456789016',
        name: 'Priya Sharma',
        mobile: '9876543214',
        email: 'priya.sharma@example.com',
        role: 'pilgrim',
        bankAccount: 'ACC123456791'
      })
    ]);

    // Verify users
    await Promise.all(users.map(user => UserService.verifyUser(user.id)));

    // Create passes with group members
    console.log('🎫 Creating passes...');
    const passes = await Promise.all([
      PassService.createPass({
        userId: users[0].id,
        zoneId: zones[0].id,
        groupSize: 3,
        exitDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tentCityDays: 2,
        extraCharges: 3000,
        totalAmount: 3500,
        groupMembers: [
          { aadhaar: '123456789012', name: 'Ram Kumar', age: 35, relation: 'self' },
          { aadhaar: '234567890123', name: 'Seeta Kumar', age: 32, relation: 'wife' },
          { aadhaar: '345678901234', name: 'Arjun Kumar', age: 8, relation: 'son' }
        ]
      }),
      PassService.createPass({
        userId: users[1].id,
        zoneId: zones[1].id,
        groupSize: 2,
        exitDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        tentCityDays: 1,
        extraCharges: 1000,
        totalAmount: 1200,
        groupMembers: [
          { aadhaar: '123456789013', name: 'Sita Devi', age: 45, relation: 'self' },
          { aadhaar: '456789012345', name: 'Maya Devi', age: 70, relation: 'mother' }
        ]
      }),
      PassService.createPass({
        userId: users[4].id,
        zoneId: zones[2].id,
        groupSize: 1,
        exitDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        extraCharges: 0,
        totalAmount: 200,
        groupMembers: [
          { aadhaar: '123456789016', name: 'Priya Sharma', age: 28, relation: 'self' }
        ]
      })
    ]);

    // Mark some passes as entered
    await PassService.markPassEntry(passes[0].id);
    await PassService.markPassEntry(passes[1].id);

    // Create IoT sensors
    console.log('📡 Creating IoT sensors...');
    const sensors = await Promise.all([
      CrowdService.createSensor({
        zoneId: zones[0].id,
        sensorId: 'SENSOR_SANGAM_001',
        type: 'people_counter',
        location: 'Main Entry Gate'
      }),
      CrowdService.createSensor({
        zoneId: zones[0].id,
        sensorId: 'SENSOR_SANGAM_002',
        type: 'thermal_camera',
        location: 'Bathing Area Overlook'
      }),
      CrowdService.createSensor({
        zoneId: zones[1].id,
        sensorId: 'SENSOR_AKSHAYA_001',
        type: 'people_counter',
        location: 'Temple Entrance'
      }),
      CrowdService.createSensor({
        zoneId: zones[2].id,
        sensorId: 'SENSOR_HANUMAN_001',
        type: 'people_counter',
        location: 'Main Temple Gate'
      }),
      CrowdService.createSensor({
        zoneId: zones[3].id,
        sensorId: 'SENSOR_PATAL_001',
        type: 'rfid_reader',
        location: 'Underground Entry'
      })
    ]);

    // Generate crowd data for the last few days
    console.log('📊 Generating crowd data...');
    const now = new Date();
    for (let i = 0; i < 7; i++) { // Last 7 days
      for (let hour = 0; hour < 24; hour += 2) { // Every 2 hours
        const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000);
        
        for (const zone of zones) {
          const baseCount = Math.floor(zone.maxCapacity * 0.3); // 30% base
          const variation = Math.floor(Math.random() * zone.maxCapacity * 0.4); // Up to 40% variation
          const timeMultiplier = hour >= 6 && hour <= 10 ? 1.5 : hour >= 16 && hour <= 20 ? 1.3 : 0.8;
          
          const currentCount = Math.min(
            zone.maxCapacity,
            Math.floor((baseCount + variation) * timeMultiplier)
          );
          
          const density = (currentCount / zone.maxCapacity) * 100;
          let status = 'normal';
          if (density >= 90) status = 'critical';
          else if (density >= 75) status = 'warning';

          await CrowdService.recordCrowdData({
            zoneId: zone.id,
            currentCount,
            density,
            status,
            temperature: 20 + Math.random() * 15,
            humidity: 40 + Math.random() * 30,
            soundLevel: 40 + Math.random() * 40,
          });
        }
      }
    }

    // Create some alerts
    console.log('🚨 Creating alerts...');
    await Promise.all([
      CrowdService.createAlert(
        'capacity',
        'Zone approaching maximum capacity - consider traffic diversion',
        'high',
        zones[0].id
      ),
      CrowdService.createAlert(
        'system',
        'Sensor battery low - maintenance required',
        'medium',
        zones[1].id
      ),
      CrowdService.createAlert(
        'emergency',
        'Medical assistance requested at location',
        'critical',
        zones[2].id
      )
    ]);

    // Create notifications
    console.log('🔔 Creating notifications...');
    await Promise.all([
      NotificationService.createNotification({
        userId: users[0].id,
        title: 'Pass Generated Successfully',
        message: 'Your pass for Sangam Ghat has been generated. Please check your QR code.',
        type: 'system'
      }),
      NotificationService.createNotification({
        userId: users[1].id,
        title: 'Entry Confirmed',
        message: 'Welcome to Mahakumbh! Your entry has been recorded.',
        type: 'system'
      }),
      NotificationService.createNotification({
        userId: users[4].id,
        title: 'Exit Reminder',
        message: 'Your pass expires in 24 hours. Please plan your exit accordingly.',
        type: 'sms'
      })
    ]);

    // Create a penalty for demonstration
    console.log('💰 Creating penalty...');
    const overstayPass = await PassService.createPass({
      userId: users[0].id,
      zoneId: zones[3].id,
      groupSize: 1,
      exitDeadline: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago (overstay)
      extraCharges: 0,
      totalAmount: 100,
      groupMembers: [
        { aadhaar: '123456789012', name: 'Ram Kumar', age: 35, relation: 'self' }
      ]
    });

    await PassService.markPassEntry(overstayPass.id);
    await PassService.updatePass(overstayPass.id, { status: 'overstay' });

    await PenaltyService.createPenalty({
      userId: users[0].id,
      passId: overstayPass.id,
      amount: 1000,
      reason: 'Overstaying beyond exit deadline by 5 hours',
      overstayHours: 5
    });

    // Create audit logs
    console.log('📝 Creating audit logs...');
    await Promise.all([
      AuditService.createAuditLog({
        userId: users[0].id,
        action: 'login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mobile App'
      }),
      AuditService.createAuditLog({
        userId: users[0].id,
        action: 'pass_generated',
        entity: 'pass',
        entityId: passes[0].id,
        newValues: { zoneId: zones[0].id, groupSize: 3 }
      }),
      AuditService.createAuditLog({
        userId: users[2].id,
        action: 'alert_created',
        entity: 'alert',
        entityId: 'alert-id-1'
      })
    ]);

    // Create system settings
    console.log('⚙️ Creating system settings...');
    await prisma.systemSetting.createMany({
      data: [
        { key: 'max_group_size', value: '10', type: 'number', category: 'passes' },
        { key: 'penalty_base_amount', value: '500', type: 'number', category: 'penalties' },
        { key: 'penalty_hourly_rate', value: '200', type: 'number', category: 'penalties' },
        { key: 'penalty_max_amount', value: '2000', type: 'number', category: 'penalties' },
        { key: 'grace_period_hours', value: '2', type: 'number', category: 'penalties' },
        { key: 'sms_enabled', value: 'true', type: 'boolean', category: 'notifications' },
        { key: 'email_enabled', value: 'true', type: 'boolean', category: 'notifications' },
        { key: 'default_pass_validity_hours', value: '72', type: 'number', category: 'passes' },
        { key: 'tent_city_price_per_night', value: '500', type: 'number', category: 'accommodation' }
      ]
    });

    // Create analytics data
    console.log('📈 Creating analytics data...');
    for (let i = 0; i < 30; i++) { // Last 30 days
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      await prisma.analytics.create({
        data: {
          date,
          totalVisitors: Math.floor(Math.random() * 50000) + 10000,
          totalPasses: Math.floor(Math.random() * 5000) + 1000,
          totalRevenue: Math.floor(Math.random() * 100000) + 20000,
          avgDensity: Math.random() * 100,
          peakHour: Math.floor(Math.random() * 24),
          weatherData: JSON.stringify({
            temperature: 15 + Math.random() * 20,
            humidity: 40 + Math.random() * 40,
            conditions: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
          }),
          events: JSON.stringify({
            specialEvents: i % 7 === 0 ? ['Shahi Snan'] : [],
            incidents: Math.random() > 0.8 ? ['Minor crowd buildup'] : []
          })
        }
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created:
    - ${zones.length} zones
    - ${users.length} users
    - ${passes.length + 1} passes (including overstay demo)
    - ${sensors.length} IoT sensors
    - 168 crowd data entries (7 days × 24 zones × 1 entry)
    - 3 alerts
    - 3 notifications
    - 1 penalty
    - 3 audit logs
    - 9 system settings
    - 30 analytics entries`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Auto-run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

export default seedDatabase;
