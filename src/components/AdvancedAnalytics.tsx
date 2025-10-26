import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Clock } from 'lucide-react';

// Mock data for charts
const hourlyData = [
  { time: '06:00', visitors: 120, capacity: 80 },
  { time: '07:00', visitors: 200, capacity: 85 },
  { time: '08:00', visitors: 350, capacity: 90 },
  { time: '09:00', visitors: 480, capacity: 95 },
  { time: '10:00', visitors: 650, capacity: 98 },
  { time: '11:00', visitors: 720, capacity: 100 },
  { time: '12:00', visitors: 580, capacity: 95 },
  { time: '13:00', visitors: 420, capacity: 85 },
  { time: '14:00', visitors: 380, capacity: 80 },
  { time: '15:00', visitors: 450, capacity: 88 },
  { time: '16:00', visitors: 520, capacity: 92 },
  { time: '17:00', visitors: 380, capacity: 78 },
];

const zoneData = [
  { name: 'Main Temple', current: 450, capacity: 500, utilization: 90 },
  { name: 'Entry Gate A', current: 280, capacity: 300, utilization: 93 },
  { name: 'Entry Gate B', current: 220, capacity: 300, utilization: 73 },
  { name: 'Parking Area', current: 180, capacity: 200, utilization: 90 },
  { name: 'Food Court', current: 120, capacity: 150, utilization: 80 },
  { name: 'Rest Area', current: 80, capacity: 100, utilization: 80 },
];

const crowdFlowData = [
  { name: 'Entry', in: 450, out: 120 },
  { name: 'Main Area', in: 380, out: 200 },
  { name: 'Temple', in: 320, out: 180 },
  { name: 'Exit', in: 200, out: 380 },
];

const weeklyTrends = [
  { day: 'Mon', visitors: 1200, incidents: 2, satisfaction: 85 },
  { day: 'Tue', visitors: 980, incidents: 1, satisfaction: 88 },
  { day: 'Wed', visitors: 1100, incidents: 3, satisfaction: 82 },
  { day: 'Thu', visitors: 1350, incidents: 2, satisfaction: 86 },
  { day: 'Fri', visitors: 1800, incidents: 4, satisfaction: 80 },
  { day: 'Sat', visitors: 2200, incidents: 5, satisfaction: 75 },
  { day: 'Sun', visitors: 2500, incidents: 6, satisfaction: 78 },
];

const alertDistribution = [
  { name: 'Crowd Alert', value: 45, color: '#ef4444' },
  { name: 'Safety Alert', value: 25, color: '#f97316' },
  { name: 'System Alert', value: 20, color: '#eab308' },
  { name: 'Maintenance', value: 10, color: '#22c55e' },
];

const radarData = [
  { metric: 'Crowd Density', current: 85, optimal: 70, max: 100 },
  { metric: 'Safety Score', current: 92, optimal: 95, max: 100 },
  { metric: 'Flow Efficiency', current: 78, optimal: 85, max: 100 },
  { metric: 'Response Time', current: 88, optimal: 90, max: 100 },
  { metric: 'Satisfaction', current: 82, optimal: 90, max: 100 },
  { metric: 'Resource Usage', current: 75, optimal: 80, max: 100 },
];

const AdvancedAnalytics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('common.total')} {t('analytics.visitorFlow')}
                </p>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from yesterday
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('analytics.crowdDensity')}
                </p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-orange-600">High density</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-orange-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('alerts.crowdAlert')}s Today
                </p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-red-600">5 active</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold">2.3m</p>
                <p className="text-xs text-green-600">Within target</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime">{t('analytics.realTimeData')}</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.crowdDensity')} - Live</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="capacity"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crowd Flow Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crowdFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="in" fill="#22c55e" name="Incoming" />
                    <Bar dataKey="out" fill="#ef4444" name="Outgoing" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Visitors"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Satisfaction %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="incidents"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.zoneComparison')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={zoneData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#3b82f6" name="Current" />
                  <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {alertDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Severity Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="capacity"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Optimal"
                    dataKey="optimal"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.1}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;