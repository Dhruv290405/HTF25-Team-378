import prisma from '@/lib/database';
import { Pass, GroupMember, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePassData {
  userId: string;
  zoneId: string;
  groupSize: number;
  tentCityDays?: number;
  extraCharges?: number;
  totalAmount?: number;
  exitDeadline: Date;
  groupMembers: Array<{
    aadhaar: string;
    name: string;
    age?: number;
    relation?: string;
  }>;
}

export interface UpdatePassData {
  status?: string;
  entryTime?: Date;
  exitTime?: Date;
  tentCityDays?: number;
  extraCharges?: number;
}

export class PassService {
  // Generate QR code
  static generateQRCode(passId: string): string {
    return `MAHAKUMBH2028_${passId}_${Date.now()}`;
  }

  // Create a new pass
  static async createPass(passData: CreatePassData): Promise<Pass> {
    const passId = uuidv4();
    const qrCode = this.generateQRCode(passId);

    return await prisma.$transaction(async (tx) => {
      // Create the pass
      const pass = await tx.pass.create({
        data: {
          id: passId,
          userId: passData.userId,
          zoneId: passData.zoneId,
          qrCode,
          groupSize: passData.groupSize,
          exitDeadline: passData.exitDeadline,
          tentCityDays: passData.tentCityDays,
          extraCharges: passData.extraCharges || 0,
          totalAmount: passData.totalAmount || 0,
        }
      });

      // Create group members
      if (passData.groupMembers && passData.groupMembers.length > 0) {
        await tx.groupMember.createMany({
          data: passData.groupMembers.map(member => ({
            id: uuidv4(),
            passId: passId,
            aadhaar: member.aadhaar,
            name: member.name,
            age: member.age,
            relation: member.relation,
          }))
        });
      }

      return pass;
    });
  }

  // Get pass by ID
  static async getPassById(passId: string) {
    return await prisma.pass.findUnique({
      where: { id: passId },
      include: {
        user: true,
        zone: true,
        groupMembers: true,
        penalties: true,
      }
    });
  }

  // Get pass by QR code
  static async getPassByQRCode(qrCode: string) {
    return await prisma.pass.findUnique({
      where: { qrCode },
      include: {
        user: true,
        zone: true,
        groupMembers: true,
      }
    });
  }

  // Get user passes
  static async getUserPasses(userId: string) {
    return await prisma.pass.findMany({
      where: { userId },
      include: {
        zone: true,
        groupMembers: true,
        penalties: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Update pass
  static async updatePass(passId: string, updateData: UpdatePassData): Promise<Pass> {
    return await prisma.pass.update({
      where: { id: passId },
      data: updateData,
    });
  }

  // Mark pass entry
  static async markPassEntry(passId: string): Promise<Pass> {
    return await prisma.pass.update({
      where: { id: passId },
      data: {
        entryTime: new Date(),
        status: 'used'
      }
    });
  }

  // Mark pass exit
  static async markPassExit(passId: string): Promise<Pass> {
    const now = new Date();
    
    return await prisma.$transaction(async (tx) => {
      const pass = await tx.pass.findUnique({
        where: { id: passId }
      });

      if (!pass) {
        throw new Error('Pass not found');
      }

      // Check if overstaying
      const isOverstay = now > pass.exitDeadline;
      
      return await tx.pass.update({
        where: { id: passId },
        data: {
          exitTime: now,
          status: isOverstay ? 'overstay' : 'used'
        }
      });
    });
  }

  // Get passes by zone
  static async getPassesByZone(zoneId: string) {
    return await prisma.pass.findMany({
      where: { zoneId },
      include: {
        user: true,
        groupMembers: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get active passes (currently inside)
  static async getActivePasses() {
    return await prisma.pass.findMany({
      where: {
        AND: [
          { entryTime: { not: null } },
          { exitTime: null },
          { status: { in: ['used', 'overstay'] } }
        ]
      },
      include: {
        user: true,
        zone: true,
        groupMembers: true,
      }
    });
  }

  // Get overstay passes
  static async getOverstayPasses() {
    const now = new Date();
    
    return await prisma.pass.findMany({
      where: {
        AND: [
          { entryTime: { not: null } },
          { exitTime: null },
          { exitDeadline: { lt: now } }
        ]
      },
      include: {
        user: true,
        zone: true,
        groupMembers: true,
      }
    });
  }

  // Calculate penalty for overstay
  static async calculatePenalty(passId: string): Promise<number> {
    const pass = await prisma.pass.findUnique({
      where: { id: passId }
    });

    if (!pass) {
      throw new Error('Pass not found');
    }

    const now = new Date();
    const overstayMs = now.getTime() - pass.exitDeadline.getTime();
    const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));

    if (overstayHours <= 2) {
      return 0; // Grace period
    }

    const penaltyHours = overstayHours - 2;
    let penalty = 500; // Base penalty for first 2 hours after grace period

    if (penaltyHours > 2) {
      penalty += (penaltyHours - 2) * 200; // Additional hours
    }

    return Math.min(penalty, 2000); // Cap at 2000
  }

  // Get pass statistics
  static async getPassStats() {
    const [totalPasses, activePasses, completedPasses, overstayPasses] = await Promise.all([
      prisma.pass.count(),
      prisma.pass.count({
        where: {
          AND: [
            { entryTime: { not: null } },
            { exitTime: null }
          ]
        }
      }),
      prisma.pass.count({
        where: { 
          AND: [
            { entryTime: { not: null } },
            { exitTime: { not: null } }
          ]
        }
      }),
      prisma.pass.count({
        where: { status: 'overstay' }
      })
    ]);

    return {
      totalPasses,
      activePasses,
      completedPasses,
      overstayPasses
    };
  }

  // Get passes by date range
  static async getPassesByDateRange(startDate: Date, endDate: Date) {
    return await prisma.pass.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: true,
        zone: true,
        groupMembers: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Cancel pass
  static async cancelPass(passId: string): Promise<Pass> {
    return await prisma.pass.update({
      where: { id: passId },
      data: { status: 'cancelled' }
    });
  }
}
