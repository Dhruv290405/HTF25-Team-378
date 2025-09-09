import { UserService } from './database/userService';
import { PassService } from './database/passService';
import { CrowdService } from './database/crowdService';
import { NotificationService, PenaltyService, AuditService } from './database/notificationService';

// Types that match the original mockData interface but use database data
export interface CrowdData {
  zoneId: string;
  zoneName: string;
  currentCount: number;
  maxCapacity: number;
  density: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface GroupMember {
  aadhaar: string;
  name: string;
  age?: number;
  relation?: string;
}

export interface Pass {
  id: string;
  userId: string;
  zoneId: string;
  zoneName: string;
  entryTime: Date | null;
  exitDeadline: Date;
  exitTime?: Date | null;
  status: 'active' | 'used' | 'expired' | 'overstay';
  qrCode: string;
  groupSize: number;
  groupMembers: GroupMember[];
  tentCityDays?: number;
  extraCharges?: number;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'capacity' | 'emergency' | 'fraud' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

export interface Penalty {
  id: string;
  userId: string;
  passId: string;
  amount: number;
  reason: string;
  dateIssued: Date;
  status: 'pending' | 'paid' | 'auto_deducted';
  smsAlertSent: boolean;
  overstayHours: number;
}

// Enhanced database service class
export class DatabaseService {
  
  // Crowd Data Functions (compatible with mockData interface)
  static async getCrowdData(): Promise<CrowdData[]> {
    try {
      const crowdDataWithZones = await CrowdService.getLatestCrowdData();
      
      return crowdDataWithZones.map(data => ({
        zoneId: data.zoneId,
        zoneName: data.zone.name,
        currentCount: data.currentCount,
        maxCapacity: data.zone.maxCapacity,
        density: data.density,
        status: data.status as 'normal' | 'warning' | 'critical',
        lastUpdated: data.timestamp
      }));
    } catch (error) {
      console.error('Failed to get crowd data:', error);
      return [];
    }
  }

  static async generateLiveCrowdData(): Promise<CrowdData[]> {
    // This generates new crowd data and returns the latest
    try {
      // Get all zones
      const zones = await CrowdService.getAllZones();
      
      // Generate new crowd data for each zone
      const promises = zones.map(async (zone) => {
        // Get the latest data for this zone to base variation on
        const recentData = await CrowdService.getCrowdDataByZone(zone.id, 1);
        const baseCount = recentData.length > 0 ? recentData[recentData.length - 1].currentCount : zone.maxCapacity * 0.3;
        
        // Apply some variation (±10%)
        const variation = (Math.random() - 0.5) * 0.2;
        const newCount = Math.max(0, Math.min(zone.maxCapacity, Math.floor(baseCount * (1 + variation))));
        const newDensity = (newCount / zone.maxCapacity) * 100;
        
        let status: string = 'normal';
        if (newDensity >= 90) status = 'critical';
        else if (newDensity >= 75) status = 'warning';

        // Record the new data
        await CrowdService.recordCrowdData({
          zoneId: zone.id,
          currentCount: newCount,
          density: newDensity,
          status,
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 30,
          soundLevel: 40 + Math.random() * 40,
        });

        return {
          zoneId: zone.id,
          zoneName: zone.name,
          currentCount: newCount,
          maxCapacity: zone.maxCapacity,
          density: newDensity,
          status: status as 'normal' | 'warning' | 'critical',
          lastUpdated: new Date()
        };
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error('Failed to generate live crowd data:', error);
      return [];
    }
  }

  // Alerts Functions
  static async getAlerts(): Promise<Alert[]> {
    try {
      const alerts = await CrowdService.getActiveAlerts();
      
      return alerts.map(alert => ({
        id: alert.id,
        zoneId: alert.zoneId || '',
        zoneName: alert.zone?.name || 'System',
        type: alert.type as 'capacity' | 'emergency' | 'fraud' | 'system',
        message: alert.message,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
        timestamp: alert.createdAt,
        resolved: alert.isResolved
      }));
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  }

  static async generateMockAlerts(): Promise<Alert[]> {
    // This creates some dynamic alerts based on current conditions
    try {
      const crowdData = await this.getCrowdData();
      const alerts: Alert[] = [];

      // Generate capacity alerts for critical zones
      const criticalZones = crowdData.filter(zone => zone.status === 'critical');
      for (const zone of criticalZones) {
        if (Math.random() > 0.7) { // 30% chance to generate alert
          const alert = await CrowdService.createAlert(
            'capacity',
            `${zone.zoneName} is at ${Math.round(zone.density)}% capacity. Consider crowd control measures.`,
            'high',
            zone.zoneId
          );

          alerts.push({
            id: alert.id,
            zoneId: zone.zoneId,
            zoneName: zone.zoneName,
            type: 'capacity',
            message: alert.message,
            severity: 'high',
            timestamp: alert.createdAt,
            resolved: false
          });
        }
      }

      // Generate random system alerts
      const systemMessages = [
        'IoT sensor battery low - maintenance required',
        'Network connectivity issues detected',
        'Database backup completed successfully',
        'New software update available'
      ];

      if (Math.random() > 0.8) { // 20% chance
        const message = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        const severity = message.includes('low') || message.includes('issues') ? 'medium' : 'low';
        
        const alert = await CrowdService.createAlert('system', message, severity);
        alerts.push({
          id: alert.id,
          zoneId: '',
          zoneName: 'System',
          type: 'system',
          message: alert.message,
          severity: severity as 'low' | 'medium' | 'high' | 'critical',
          timestamp: alert.createdAt,
          resolved: false
        });
      }

      return alerts;
    } catch (error) {
      console.error('Failed to generate alerts:', error);
      return [];
    }
  }

  // Pass Functions
  static async getUserPasses(userId: string): Promise<Pass[]> {
    try {
      const passes = await PassService.getUserPasses(userId);
      
      return passes.map(pass => ({
        id: pass.id,
        userId: pass.userId,
        zoneId: pass.zoneId,
        zoneName: pass.zone.name,
        entryTime: pass.entryTime,
        exitDeadline: pass.exitDeadline,
        exitTime: pass.exitTime,
        status: pass.status as 'active' | 'used' | 'expired' | 'overstay',
        qrCode: pass.qrCode,
        groupSize: pass.groupSize,
        groupMembers: pass.groupMembers.map(member => ({
          aadhaar: member.aadhaar,
          name: member.name,
          age: member.age || undefined,
          relation: member.relation || undefined
        })),
        tentCityDays: pass.tentCityDays || undefined,
        extraCharges: pass.extraCharges || undefined
      }));
    } catch (error) {
      console.error('Failed to get user passes:', error);
      return [];
    }
  }

  static async generatePass(
    userId: string,
    zoneId: string,
    zoneName: string,
    groupMembers: GroupMember[],
    tentCityDays?: number
  ): Promise<Pass> {
    try {
      const exitDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000); // 3 days default
      const extraCharges = tentCityDays ? tentCityDays * 500 * groupMembers.length : 0;
      const totalAmount = 200 + extraCharges; // Base price + extras

      const pass = await PassService.createPass({
        userId,
        zoneId,
        groupSize: groupMembers.length,
        exitDeadline,
        tentCityDays,
        extraCharges,
        totalAmount,
        groupMembers
      });

      // Create audit log
      await AuditService.createAuditLog({
        userId,
        action: 'pass_generated',
        entity: 'pass',
        entityId: pass.id,
        newValues: {
          zoneId,
          groupSize: groupMembers.length,
          exitDeadline: exitDeadline.toISOString()
        }
      });

      // Create notification
      await NotificationService.createNotification({
        userId,
        title: 'Pass Generated Successfully',
        message: `Your pass for ${zoneName} has been generated successfully. Valid until ${exitDeadline.toLocaleString()}.`,
        type: 'system'
      });

      return {
        id: pass.id,
        userId: pass.userId,
        zoneId: pass.zoneId,
        zoneName,
        entryTime: pass.entryTime,
        exitDeadline: pass.exitDeadline,
        exitTime: pass.exitTime,
        status: pass.status as 'active' | 'used' | 'expired' | 'overstay',
        qrCode: pass.qrCode,
        groupSize: pass.groupSize,
        groupMembers: groupMembers,
        tentCityDays,
        extraCharges
      };
    } catch (error) {
      console.error('Failed to generate pass:', error);
      throw error;
    }
  }

  // Penalty Functions
  static async getUserPenalties(userId: string): Promise<Penalty[]> {
    try {
      const penalties = await PenaltyService.getUserPenalties(userId);
      
      return penalties.map(penalty => ({
        id: penalty.id,
        userId: penalty.userId,
        passId: penalty.passId,
        amount: penalty.amount,
        reason: penalty.reason,
        status: penalty.status as 'pending' | 'paid' | 'auto_deducted',
        dateIssued: penalty.dateIssued,
        smsAlertSent: penalty.smsAlertSent,
        overstayHours: penalty.overstayHours
      }));
    } catch (error) {
      console.error('Failed to get user penalties:', error);
      return [];
    }
  }

  // QR Code Generation
  static generateQRCode(passId: string): string {
    return `MAHAKUMBH2028_${passId}_${Date.now()}`;
  }

  // Authentication Functions
  static async authenticateUser(aadhaar: string): Promise<any> {
    try {
      const user = await UserService.getUserByAadhaar(aadhaar);
      
      if (user) {
        // Create audit log for login
        await AuditService.createAuditLog({
          userId: user.id,
          action: 'login',
          ipAddress: '127.0.0.1', // In real app, get from request
          userAgent: 'Web Browser'
        });

        return {
          id: user.id,
          aadhaar: user.aadhaar,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          passes: user.passes?.map(pass => ({
            id: pass.id,
            zoneId: pass.zoneId,
            zoneName: pass.zone?.name,
            status: pass.status,
            entryTime: pass.entryTime,
            exitDeadline: pass.exitDeadline,
            qrCode: pass.qrCode,
            groupSize: pass.groupSize,
            groupMembers: pass.groupMembers
          })) || [],
          penalties: user.penalties || [],
          unreadNotifications: user.notifications?.filter(n => !n.isRead).length || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to authenticate user:', error);
      return null;
    }
  }

  // Analytics Functions
  static async getAnalytics(days: number = 7) {
    try {
      const [
        passStats,
        crowdTrends,
        penaltyStats,
        systemHealth
      ] = await Promise.all([
        PassService.getPassStats(),
        CrowdService.getCrowdTrends(days),
        PenaltyService.getPenaltyStats(),
        CrowdService.getSystemHealthStatus()
      ]);

      return {
        passes: passStats,
        crowdTrends,
        penalties: penaltyStats,
        systemHealth,
        totalRevenue: penaltyStats.paidAmount,
        averageDensity: crowdTrends.length > 0 ? 
          crowdTrends.reduce((sum, data) => sum + data.density, 0) / crowdTrends.length : 0
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return null;
    }
  }

  // Automated System Functions
  static async processOverstayPenalties() {
    try {
      const penalties = await PenaltyService.processOverstayPenalties();
      
      // Send notifications for new penalties
      for (const penalty of penalties) {
        await NotificationService.createNotification({
          userId: penalty.userId,
          title: 'Penalty Issued',
          message: `A penalty of ₹${penalty.amount} has been issued for overstaying. ${penalty.reason}`,
          type: 'sms'
        });
      }

      return penalties;
    } catch (error) {
      console.error('Failed to process overstay penalties:', error);
      return [];
    }
  }

  // Utility Functions
  static async getSystemStats() {
    try {
      const [userStats, passStats, systemHealth] = await Promise.all([
        UserService.getUserStats(),
        PassService.getPassStats(),
        CrowdService.getSystemHealthStatus()
      ]);

      return {
        users: userStats,
        passes: passStats,
        system: systemHealth,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to get system stats:', error);
      return null;
    }
  }
}

// Export individual service classes for direct access
export { UserService, PassService, CrowdService, NotificationService, PenaltyService, AuditService };

// Export the main database service as default
export default DatabaseService;
