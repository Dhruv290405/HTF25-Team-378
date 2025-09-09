import prisma from '@/lib/database';
import { Notification, Penalty, AuditLog } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: string; // sms, email, push, system
}

export interface CreatePenaltyData {
  userId: string;
  passId: string;
  amount: number;
  reason: string;
  overstayHours: number;
}

export interface CreateAuditLogData {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class NotificationService {
  // Notification Management
  static async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    return await prisma.notification.create({
      data: {
        id: uuidv4(),
        ...notificationData,
      }
    });
  }

  static async getUserNotifications(userId: string, unreadOnly: boolean = false) {
    return await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { isRead: false })
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  static async markNotificationAsSent(notificationId: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });
  }

  static async markNotificationAsFailed(notificationId: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'failed'
      }
    });
  }

  static async getPendingNotifications(): Promise<Notification[]> {
    return await prisma.notification.findMany({
      where: { status: 'pending' },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async deleteOldNotifications(olderThanDays: number = 30): Promise<void> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true
      }
    });
  }

  // Bulk notifications
  static async createBulkNotification(
    userIds: string[],
    title: string,
    message: string,
    type: string = 'system'
  ): Promise<void> {
    const notifications = userIds.map(userId => ({
      id: uuidv4(),
      userId,
      title,
      message,
      type
    }));

    await prisma.notification.createMany({
      data: notifications
    });
  }
}

export class PenaltyService {
  // Penalty Management
  static async createPenalty(penaltyData: CreatePenaltyData): Promise<Penalty> {
    return await prisma.penalty.create({
      data: {
        id: uuidv4(),
        ...penaltyData,
      }
    });
  }

  static async getUserPenalties(userId: string) {
    return await prisma.penalty.findMany({
      where: { userId },
      include: {
        pass: {
          include: { zone: true }
        }
      },
      orderBy: { dateIssued: 'desc' }
    });
  }

  static async getPenaltyById(penaltyId: string) {
    return await prisma.penalty.findUnique({
      where: { id: penaltyId },
      include: {
        user: true,
        pass: {
          include: { zone: true }
        }
      }
    });
  }

  static async markPenaltyAsPaid(penaltyId: string): Promise<Penalty> {
    return await prisma.penalty.update({
      where: { id: penaltyId },
      data: {
        status: 'paid',
        datePaid: new Date()
      }
    });
  }

  static async markPenaltyAsAutoDeducted(penaltyId: string): Promise<Penalty> {
    return await prisma.penalty.update({
      where: { id: penaltyId },
      data: {
        status: 'auto_deducted',
        datePaid: new Date()
      }
    });
  }

  static async waivePenalty(penaltyId: string): Promise<Penalty> {
    return await prisma.penalty.update({
      where: { id: penaltyId },
      data: {
        status: 'waived'
      }
    });
  }

  static async getPendingPenalties() {
    return await prisma.penalty.findMany({
      where: { status: 'pending' },
      include: {
        user: true,
        pass: {
          include: { zone: true }
        }
      },
      orderBy: { dateIssued: 'desc' }
    });
  }

  static async getPenaltyStats() {
    const [totalPenalties, pendingAmount, paidAmount, totalAmount] = await Promise.all([
      prisma.penalty.count(),
      prisma.penalty.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true }
      }),
      prisma.penalty.aggregate({
        where: { status: { in: ['paid', 'auto_deducted'] } },
        _sum: { amount: true }
      }),
      prisma.penalty.aggregate({
        _sum: { amount: true }
      })
    ]);

    return {
      totalPenalties,
      pendingAmount: pendingAmount._sum.amount || 0,
      paidAmount: paidAmount._sum.amount || 0,
      totalAmount: totalAmount._sum.amount || 0,
      collectionRate: totalAmount._sum.amount ? 
        ((paidAmount._sum.amount || 0) / totalAmount._sum.amount) * 100 : 0
    };
  }

  static async updateSmsAlertStatus(penaltyId: string, sent: boolean): Promise<Penalty> {
    return await prisma.penalty.update({
      where: { id: penaltyId },
      data: { smsAlertSent: sent }
    });
  }

  static async updateEmailAlertStatus(penaltyId: string, sent: boolean): Promise<Penalty> {
    return await prisma.penalty.update({
      where: { id: penaltyId },
      data: { emailAlertSent: sent }
    });
  }

  // Auto penalty creation for overstay
  static async processOverstayPenalties(): Promise<Penalty[]> {
    const overstayPasses = await prisma.pass.findMany({
      where: {
        AND: [
          { entryTime: { not: null } },
          { exitTime: null },
          { exitDeadline: { lt: new Date() } },
          { status: { not: 'cancelled' } }
        ]
      },
      include: { user: true, zone: true }
    });

    const penalties = [];

    for (const pass of overstayPasses) {
      const existingPenalty = await prisma.penalty.findFirst({
        where: {
          passId: pass.id,
          status: { in: ['pending', 'paid', 'auto_deducted'] }
        }
      });

      if (!existingPenalty) {
        const now = new Date();
        const overstayMs = now.getTime() - pass.exitDeadline.getTime();
        const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));

        if (overstayHours > 2) { // Grace period
          const penaltyHours = overstayHours - 2;
          let amount = 500; // Base penalty
          
          if (penaltyHours > 2) {
            amount += (penaltyHours - 2) * 200;
          }
          
          amount = Math.min(amount, 2000); // Cap

          const penalty = await this.createPenalty({
            userId: pass.userId,
            passId: pass.id,
            amount,
            reason: `Overstaying beyond ${pass.exitDeadline.toLocaleString()} by ${overstayHours} hours`,
            overstayHours
          });

          penalties.push(penalty);

          // Update pass status
          await prisma.pass.update({
            where: { id: pass.id },
            data: { status: 'overstay' }
          });
        }
      }
    }

    return penalties;
  }
}

export class AuditService {
  // Audit Log Management
  static async createAuditLog(auditData: CreateAuditLogData): Promise<AuditLog> {
    return await prisma.auditLog.create({
      data: {
        id: uuidv4(),
        ...auditData,
        oldValues: auditData.oldValues ? JSON.stringify(auditData.oldValues) : null,
        newValues: auditData.newValues ? JSON.stringify(auditData.newValues) : null,
      }
    });
  }

  static async getUserAuditLogs(userId: string, limit: number = 100) {
    return await prisma.auditLog.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getEntityAuditLogs(entity: string, entityId: string, limit: number = 50) {
    return await prisma.auditLog.findMany({
      where: { entity, entityId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getSystemAuditLogs(limit: number = 200) {
    return await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getAuditLogsByAction(action: string, limit: number = 100) {
    return await prisma.auditLog.findMany({
      where: { action },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  static async getAuditLogsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAuditStats() {
    const [totalLogs, todayLogs, userLogins, passGenerations] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.auditLog.count({
        where: { action: 'login' }
      }),
      prisma.auditLog.count({
        where: { action: 'pass_generated' }
      })
    ]);

    return {
      totalLogs,
      todayLogs,
      userLogins,
      passGenerations
    };
  }

  static async deleteOldAuditLogs(olderThanDays: number = 90): Promise<void> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });
  }
}
