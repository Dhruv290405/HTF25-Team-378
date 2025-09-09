import prisma from '@/lib/database';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface CreateUserData {
  aadhaar: string;
  name: string;
  mobile: string;
  email?: string;
  role?: string;
  bankAccount?: string;
}

export interface UpdateUserData {
  name?: string;
  mobile?: string;
  email?: string;
  bankAccount?: string;
  isVerified?: boolean;
}

export class UserService {
  // Create a new user
  static async createUser(userData: CreateUserData): Promise<User> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { aadhaar: userData.aadhaar },
          { mobile: userData.mobile }
        ]
      }
    });

    if (existingUser) {
      throw new Error('User with this Aadhaar or mobile number already exists');
    }

    return await prisma.user.create({
      data: {
        id: uuidv4(),
        ...userData,
      }
    });
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        passes: true,
        penalties: true,
        notifications: true,
      }
    });
  }

  // Get user by Aadhaar
  static async getUserByAadhaar(aadhaar: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { aadhaar },
      include: {
        passes: {
          include: {
            zone: true,
            groupMembers: true,
          }
        },
        penalties: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  // Get user by mobile
  static async getUserByMobile(mobile: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { mobile },
    });
  }

  // Update user
  static async updateUser(userId: string, updateData: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Verify user
  static async verifyUser(userId: string): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  // Get all users (for admin)
  static async getAllUsers(
    page: number = 1,
    limit: number = 50,
    role?: string
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const whereClause: Prisma.UserWhereInput = role ? { role } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              passes: true,
              penalties: true,
            }
          }
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Search users
  static async searchUsers(query: string): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { aadhaar: { contains: query } },
          { mobile: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Delete user (soft delete - mark as inactive)
  static async deleteUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: false } // Using isVerified as soft delete flag
    });
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    pilgrims: number;
    authorities: number;
  }> {
    const [totalUsers, verifiedUsers, pilgrims, authorities] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.count({ where: { role: 'pilgrim' } }),
      prisma.user.count({ where: { role: 'authority' } })
    ]);

    return {
      totalUsers,
      verifiedUsers,
      pilgrims,
      authorities
    };
  }
}
