import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import LiveHeatmap from '@/components/LiveHeatmapSVG';
import { getCrowdData, getAlerts, type CrowdData, type Alert } from '@/services/mockData';
import YoloCrowdDetection from '@/components/YoloCrowdDetection';
import YoloLive from '@/components/YoloLive';
// import SectionNavigator from '@/components/SectionNavigator';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  MapPin, 
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Video,
  Thermometer
} from 'lucide-react';

const AuthorityDashboard: React.FC = () => {
  console.log('🛡️ AuthorityDashboard: Component loaded');
  
  const { user, language, logout } = useAuth();
  const t = useTranslation(language);
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log('🔍 AuthorityDashboard: Current user:', user);

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 30 seconds for live data to reduce load
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [crowdDataResponse, alertsResponse] = await Promise.all([
        getCrowdData(),
        getAlerts()
      ]);
      
      setCrowdData(crowdDataResponse);
      setAlerts(alertsResponse);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPilgrims = () => {
    return crowdData.reduce((total, zone) => total + zone.currentCount, 0);
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.resolved).length;
  };

  const getCriticalZones = () => {
    return crowdData.filter(zone => zone.status === 'critical').length;
  };

  const getAverageCapacity = () => {
    if (crowdData.length === 0) return 0;
    const totalCapacity = crowdData.reduce((total, zone) => total + zone.density, 0);
    return Math.round(totalCapacity / crowdData.length);
  };

  const getStatusColor = (status: string): 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'normal': return 'outline';
      default: return 'outline';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const generateRecentEntries = () => {
    // Mock recent entries data
    return [
      { id: 1, time: '14:32', zone: 'Sangam Ghat', type: 'Entry', pilgrimId: 'P001234' },
      { id: 2, time: '14:31', zone: 'Akshaya Vat', type: 'Entry', pilgrimId: 'P001235' },
      { id: 3, time: '14:30', zone: 'Hanuman Temple', type: 'Exit', pilgrimId: 'P001233' },
      { id: 4, time: '14:29', zone: 'Sangam Ghat', type: 'Entry', pilgrimId: 'P001236' },
      { id: 5, time: '14:28', zone: 'Saraswati Koop', type: 'Exit', pilgrimId: 'P001232' },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gradient">TRINETRA</h1>
              <span className="text-sm text-muted-foreground">Authority Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary">Home</a>
              <a href="/pilgrim" className="text-sm text-muted-foreground hover:text-primary">Pilgrim Portal</a>
              {user && (
                <>
                  <span className="text-sm font-medium text-primary">👤 {user.name} ({user.role})</span>
                  <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
                </>
              )}
              {!user && (
                <a href="/login" className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Login</a>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {t('authority.dashboard')} {!user && <Badge variant="secondary" className="ml-2">Demo Mode</Badge>}
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time crowd monitoring, AI analytics, and management system
            </p>
            {!user && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-800 text-sm">
                  🌟 <strong>Demo Mode:</strong> You're viewing the Authority Dashboard without authentication. 
                  <a href="/login" className="underline ml-1">Login</a> for full functionality.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm" onClick={loadDashboardData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-2 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-xl shadow-medium">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow data-[state=active]:scale-105 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-primary/10"
            >
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-glow data-[state=active]:scale-105 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-secondary/10"
            >
              <TrendingUp className="w-4 h-4" />
              {t('authority.analytics')}
            </TabsTrigger>
            <TabsTrigger 
              value="heatmap"
              className="data-[state=active]:bg-warning data-[state=active]:text-white data-[state=active]:shadow-glow data-[state=active]:scale-105 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-warning/10"
            >
              <Thermometer className="w-4 h-4" />
              {t('authority.liveHeatmap')}
            </TabsTrigger>
            <TabsTrigger 
              value="live"
              className="data-[state=active]:bg-success data-[state=active]:text-white data-[state=active]:shadow-glow data-[state=active]:scale-105 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-success/10"
            >
              <Video className="w-4 h-4" />
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-glow border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-primary">{t('totalPilgrims')}</CardTitle>
              <div className="p-2 bg-primary/20 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {getTotalPilgrims().toLocaleString()}
              </div>
              <p className="text-xs text-primary/70 font-medium">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +2.3% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 hover:from-warning/10 hover:to-warning/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-warning">{t('activeAlerts')}</CardTitle>
              <div className="p-2 bg-warning/20 rounded-full">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-warning to-warning/80 bg-clip-text text-transparent">
                {getActiveAlerts()}
              </div>
              <p className="text-xs text-warning/70 font-medium">
                {getCriticalZones()} critical zones
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-glow border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-secondary">{t('zoneCapacity')}</CardTitle>
              <div className="p-2 bg-secondary/20 rounded-full">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                {getAverageCapacity()}%
              </div>
              <p className="text-xs text-secondary/70 font-medium">
                Average across all zones
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-glow border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10 hover:from-success/10 hover:to-success/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-success">System Status</CardTitle>
              <div className="p-2 bg-success/20 rounded-full">
                <Shield className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                Online
              </div>
              <p className="text-xs text-success/70 font-medium">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced YOLO AI Crowd Detection + Live Camera */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <YoloCrowdDetection />
          <YoloLive />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Live Crowd Monitoring */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-glow border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2 text-primary font-bold">
                  <Activity className="w-6 h-6" />
                  {t('liveMonitoring')}
                </CardTitle>
                <CardDescription className="text-primary/70 font-medium">
                  Real-time crowd density across sacred zones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {crowdData.map((zone) => (
                    <div key={zone.zoneId} className="flex items-center justify-between p-4 border-2 border-border/50 rounded-xl hover:border-primary/30 hover:bg-primary/5 hover:shadow-medium transition-all duration-300 bg-white/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/20 rounded-full">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-lg">{zone.zoneName}</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {zone.currentCount.toLocaleString()} / {zone.maxCapacity.toLocaleString()} pilgrims
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{Math.round(zone.density)}%</div>
                          <div className="text-xs text-muted-foreground font-medium">capacity</div>
                        </div>
                        <Badge variant={getStatusColor(zone.status)} className="px-3 py-1 font-semibold">
                          {zone.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-xl">{t('recentEntries')}</CardTitle>
                <CardDescription>
                  Latest pilgrim entry/exit activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateRecentEntries().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{entry.time}</span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span>{entry.zone}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={entry.type === 'Entry' ? 'secondary' : 'outline'}>
                          {entry.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{entry.pilgrimId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Alerts Panel */}
          <div className="space-y-6">
            <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
              <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2 text-warning font-bold">
                  <AlertTriangle className="w-6 h-6" />
                  System Alerts
                </CardTitle>
                <CardDescription className="text-warning/70 font-medium">
                  AI-generated predictions and warnings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {alerts.slice(0, 8).map((alert) => (
                    <div key={alert.id} className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-medium ${
                      alert.resolved 
                        ? 'bg-success/5 border-success/20 hover:border-success/30' 
                        : 'bg-warning/5 border-warning/20 hover:border-warning/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded-full ${alert.resolved ? 'bg-success/20' : 'bg-warning/20'}`}>
                            {alert.resolved ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-warning" />
                            )}
                          </div>
                          <Badge variant={getAlertSeverityColor(alert.severity)} className="text-xs font-semibold px-3">
                            {alert.severity}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium bg-white/50 px-2 py-1 rounded-full">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${alert.resolved ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {alert.message}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2 font-medium bg-white/30 inline-block px-2 py-1 rounded-full">
                        📍 {alert.zoneName}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Live Heatmap Tab */}
          <TabsContent value="heatmap" className="space-y-6">
            <LiveHeatmap />
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <YoloLive />
              <YoloCrowdDetection />
            </div>
          </TabsContent>

        </Tabs>

        {/* Enhanced Section Navigator - Temporarily Disabled */}
        {/* <SectionNavigator 
          activeSection={activeTab} 
          onSectionChange={setActiveTab} 
        /> */}
      </div>
    </div>
  );
};

export default AuthorityDashboard;