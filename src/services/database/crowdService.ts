import prisma from '@/lib/database';
import { CrowdData, Zone, IoTSensor, SensorReading, Alert } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface CreateZoneData {
  name: string;
  maxCapacity: number;
  location?: string;
  description?: string;
}

export interface CreateCrowdDataInput {
  zoneId: string;
  currentCount: number;
  density: number;
  status: string;
  temperature?: number;
  humidity?: number;
  soundLevel?: number;
}

export interface CreateSensorInput {
  zoneId: string;
  sensorId: string;
  type: string;
  location: string;
  status?: string;
}

export class CrowdService {
  // Zone Management
  static async createZone(zoneData: CreateZoneData): Promise<Zone> {
    return await prisma.zone.create({
      data: {
        id: uuidv4(),
        ...zoneData,
      }
    });
  }

  static async getAllZones(): Promise<Zone[]> {
    return await prisma.zone.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            passes: true,
            crowdData: true,
            iotSensors: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  static async getZoneById(zoneId: string) {
    return await prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        passes: {
          where: { 
            AND: [
              { entryTime: { not: null } },
              { exitTime: null }
            ]
          }
        },
        crowdData: {
          orderBy: { timestamp: 'desc' },
          take: 10
        },
        iotSensors: true,
        alerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  // Crowd Data Management
  static async recordCrowdData(data: CreateCrowdDataInput): Promise<CrowdData> {
    return await prisma.crowdData.create({
      data: {
        id: uuidv4(),
        ...data,
      }
    });
  }

  static async getLatestCrowdData(): Promise<(CrowdData & { zone: Zone })[]> {
    // Get the latest crowd data for each zone
    const zones = await prisma.zone.findMany({
      where: { isActive: true },
      include: {
        crowdData: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    return zones
      .filter(zone => zone.crowdData.length > 0)
      .map(zone => ({
        ...zone.crowdData[0],
        zone
      }));
  }

  static async getCrowdDataByZone(zoneId: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await prisma.crowdData.findMany({
      where: {
        zoneId,
        timestamp: { gte: since }
      },
      include: { zone: true },
      orderBy: { timestamp: 'asc' }
    });
  }

  static async getCrowdTrends(days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return await prisma.crowdData.findMany({
      where: {
        timestamp: { gte: since }
      },
      include: { zone: true },
      orderBy: { timestamp: 'asc' }
    });
  }

  // IoT Sensor Management
  static async createSensor(sensorData: CreateSensorInput): Promise<IoTSensor> {
    return await prisma.ioTSensor.create({
      data: {
        id: uuidv4(),
        ...sensorData,
      }
    });
  }

  static async getAllSensors(): Promise<IoTSensor[]> {
    return await prisma.ioTSensor.findMany({
      include: {
        zone: true,
        _count: {
          select: { readings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getSensorsByZone(zoneId: string): Promise<IoTSensor[]> {
    return await prisma.ioTSensor.findMany({
      where: { zoneId },
      include: {
        readings: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });
  }

  static async updateSensorStatus(sensorId: string, status: string, batteryLevel?: number) {
    return await prisma.ioTSensor.update({
      where: { sensorId },
      data: {
        status,
        batteryLevel,
        lastReading: new Date(),
        isOnline: status === 'active'
      }
    });
  }

  // Sensor Readings
  static async addSensorReading(
    sensorId: string,
    value: number,
    unit?: string,
    metadata?: any
  ): Promise<SensorReading> {
    return await prisma.sensorReading.create({
      data: {
        id: uuidv4(),
        sensorId,
        value,
        unit,
        metadata: metadata ? JSON.stringify(metadata) : null,
      }
    });
  }

  static async getSensorReadings(sensorId: string, hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await prisma.sensorReading.findMany({
      where: {
        sensorId,
        timestamp: { gte: since }
      },
      orderBy: { timestamp: 'asc' }
    });
  }

  // Alert Management
  static async createAlert(
    type: string,
    message: string,
    severity: string,
    zoneId?: string
  ): Promise<Alert> {
    return await prisma.alert.create({
      data: {
        id: uuidv4(),
        type,
        message,
        severity,
        zoneId,
      }
    });
  }

  static async getActiveAlerts(): Promise<(Alert & { zone?: Zone })[]> {
    return await prisma.alert.findMany({
      where: { isResolved: false },
      include: { zone: true },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async resolveAlert(alertId: string, resolvedBy: string): Promise<Alert> {
    return await prisma.alert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedBy,
        resolvedAt: new Date()
      }
    });
  }

  // Analytics
  static async getCurrentCapacityUtilization() {
    const zones = await this.getLatestCrowdData();
    
    return zones.map(data => ({
      zoneId: data.zoneId,
      zoneName: data.zone.name,
      currentCount: data.currentCount,
      maxCapacity: data.zone.maxCapacity,
      utilization: (data.currentCount / data.zone.maxCapacity) * 100,
      density: data.density,
      status: data.status,
      lastUpdated: data.timestamp
    }));
  }

  static async getPeakHoursAnalysis(days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const crowdData = await prisma.crowdData.findMany({
      where: {
        timestamp: { gte: since }
      },
      include: { zone: true }
    });

    // Group by hour and calculate averages
    const hourlyData: { [key: number]: { count: number; total: number } } = {};
    
    crowdData.forEach(data => {
      const hour = data.timestamp.getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { count: 0, total: 0 };
      }
      hourlyData[hour].count++;
      hourlyData[hour].total += data.currentCount;
    });

    return Object.entries(hourlyData).map(([hour, stats]) => ({
      hour: parseInt(hour),
      averageCount: Math.round(stats.total / stats.count),
      dataPoints: stats.count
    })).sort((a, b) => a.hour - b.hour);
  }

  static async getZoneComparison() {
    const zones = await this.getLatestCrowdData();
    
    return zones
      .map(data => ({
        zoneName: data.zone.name,
        currentCount: data.currentCount,
        maxCapacity: data.zone.maxCapacity,
        utilization: Math.round((data.currentCount / data.zone.maxCapacity) * 100),
        status: data.status
      }))
      .sort((a, b) => b.utilization - a.utilization);
  }

  static async getCrowdFlowPrediction(zoneId: string, hoursAhead: number = 6) {
    // Get historical data for the same time periods
    const historicalData = await this.getCrowdDataByZone(zoneId, 168); // 7 days
    
    if (historicalData.length === 0) {
      return [];
    }

    const now = new Date();
    const predictions = [];

    for (let i = 1; i <= hoursAhead; i++) {
      const targetTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const targetHour = targetTime.getHours();
      const targetDay = targetTime.getDay();

      // Find similar time periods in historical data
      const similarPeriods = historicalData.filter(data => {
        const dataHour = data.timestamp.getHours();
        const dataDay = data.timestamp.getDay();
        return Math.abs(dataHour - targetHour) <= 1 && dataDay === targetDay;
      });

      if (similarPeriods.length > 0) {
        const avgCount = similarPeriods.reduce((sum, data) => sum + data.currentCount, 0) / similarPeriods.length;
        const avgDensity = similarPeriods.reduce((sum, data) => sum + data.density, 0) / similarPeriods.length;
        
        predictions.push({
          timestamp: targetTime,
          predictedCount: Math.round(avgCount),
          predictedDensity: Math.round(avgDensity * 10) / 10,
          confidence: Math.min(similarPeriods.length / 5, 1) // Higher confidence with more data points
        });
      }
    }

    return predictions;
  }

  // System Health
  static async getSystemHealthStatus() {
    const [
      totalZones,
      activeZones,
      totalSensors,
      onlineSensors,
      activeAlerts,
      criticalAlerts
    ] = await Promise.all([
      prisma.zone.count(),
      prisma.zone.count({ where: { isActive: true } }),
      prisma.ioTSensor.count(),
      prisma.ioTSensor.count({ where: { isOnline: true } }),
      prisma.alert.count({ where: { isResolved: false } }),
      prisma.alert.count({ where: { isResolved: false, severity: 'critical' } })
    ]);

    return {
      zones: { total: totalZones, active: activeZones },
      sensors: { total: totalSensors, online: onlineSensors },
      alerts: { active: activeAlerts, critical: criticalAlerts },
      systemStatus: criticalAlerts > 0 ? 'critical' : activeAlerts > 5 ? 'warning' : 'healthy'
    };
  }
}
