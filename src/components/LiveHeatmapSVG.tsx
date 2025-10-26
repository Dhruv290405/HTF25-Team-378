import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Thermometer, Users, RefreshCw, Camera, Navigation } from 'lucide-react';

interface HeatmapZone {
  id: string;
  name: string;
  bounds: { x: number; y: number; width: number; height: number };
  density: number;
  count: number;
  capacity: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: Date;
}

interface CameraPoint {
  id: string;
  name: string;
  position: { x: number; y: number };
  status: 'online' | 'offline';
  viewCount: number;
}

const LiveHeatmapSVG: React.FC = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [cameras, setCameras] = useState<CameraPoint[]>([]);
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);
  const [intensityRange, setIntensityRange] = useState([0, 100]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateMockData = (): HeatmapZone[] => {
    const baseZones = [
      { name: 'Main Temple', bounds: { x: 200, y: 150, width: 120, height: 80 } },
      { name: 'Entry Gate A', bounds: { x: 50, y: 100, width: 80, height: 60 } },
      { name: 'Entry Gate B', bounds: { x: 370, y: 120, width: 80, height: 60 } },
      { name: 'Parking Area', bounds: { x: 30, y: 250, width: 150, height: 100 } },
      { name: 'Food Court', bounds: { x: 350, y: 280, width: 100, height: 70 } },
      { name: 'Rest Area', bounds: { x: 250, y: 320, width: 90, height: 60 } },
      { name: 'Gift Shop', bounds: { x: 180, y: 80, width: 70, height: 50 } },
      { name: 'Prayer Hall', bounds: { x: 300, y: 200, width: 100, height: 80 } },
    ];

    return baseZones.map((zone, index) => {
      const density = Math.random() * 100;
      const capacity = 200 + Math.random() * 300;
      const count = (density / 100) * capacity;
      
      let status: 'low' | 'medium' | 'high' | 'critical';
      if (density < 30) status = 'low';
      else if (density < 60) status = 'medium';
      else if (density < 85) status = 'high';
      else status = 'critical';

      return {
        id: `zone-${index}`,
        name: zone.name,
        bounds: zone.bounds,
        density: Math.round(density),
        count: Math.round(count),
        capacity: Math.round(capacity),
        status,
        lastUpdated: new Date()
      };
    });
  };

  const generateCameraData = (): CameraPoint[] => {
    return [
      { id: 'cam-1', name: 'Main Gate Camera', position: { x: 90, y: 130 }, status: 'online', viewCount: 145 },
      { id: 'cam-2', name: 'Temple Entrance', position: { x: 260, y: 190 }, status: 'online', viewCount: 234 },
      { id: 'cam-3', name: 'Parking Monitor', position: { x: 105, y: 300 }, status: 'online', viewCount: 89 },
      { id: 'cam-4', name: 'Food Court View', position: { x: 400, y: 315 }, status: 'offline', viewCount: 0 },
      { id: 'cam-5', name: 'Exit Monitor', position: { x: 410, y: 150 }, status: 'online', viewCount: 156 },
    ];
  };

  const getZoneColor = (status: string, opacity: number = 0.6): string => {
    const colors = {
      low: `rgba(34, 197, 94, ${opacity})`,      // Green
      medium: `rgba(249, 115, 22, ${opacity})`,  // Orange  
      high: `rgba(239, 68, 68, ${opacity})`,     // Red
      critical: `rgba(127, 29, 29, ${opacity})`, // Dark Red
    };
    return colors[status as keyof typeof colors] || colors.low;
  };

  const getStatusIcon = (status: string) => {
    const iconColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900',
    };
    return iconColors[status as keyof typeof iconColors] || iconColors.low;
  };

  const refreshData = useCallback(() => {
    const newZones = generateMockData();
    const newCameras = generateCameraData();
    setZones(newZones);
    setCameras(newCameras);
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 60000); // 60 seconds
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, refreshData]);

  const filteredZones = zones.filter(zone => 
    zone.density >= intensityRange[0] && zone.density <= intensityRange[1]
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="shadow-glow border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-primary font-bold">
            <Thermometer className="h-6 w-6" />
            {t('authority.liveHeatmap')} Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Density Range:</label>
              <div className="w-48">
                <Slider
                  value={intensityRange}
                  onValueChange={setIntensityRange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {intensityRange[0]}% - {intensityRange[1]}%
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Heatmap */}
        <div className="lg:col-span-3">
          <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
            <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-warning font-bold text-xl">
                <Navigation className="h-6 w-6" />
                Live Crowd Density Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 400"
                  className="absolute inset-0"
                >
                  {/* Background Temple Layout */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e7ff" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Temple Structure Outline */}
                  <rect x="180" y="130" width="140" height="100" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="250" y="180" textAnchor="middle" className="fill-indigo-600 text-xs font-medium">Temple Complex</text>
                  
                  {/* Heatmap Zones */}
                  {filteredZones.map((zone) => (
                    <g key={zone.id}>
                      <rect
                        x={zone.bounds.x}
                        y={zone.bounds.y}
                        width={zone.bounds.width}
                        height={zone.bounds.height}
                        fill={getZoneColor(zone.status, 0.6)}
                        stroke={getZoneColor(zone.status, 1)}
                        strokeWidth="2"
                        rx="4"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedZone(zone)}
                      />
                      <text
                        x={zone.bounds.x + zone.bounds.width / 2}
                        y={zone.bounds.y + zone.bounds.height / 2 - 5}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold pointer-events-none"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                      >
                        {zone.name}
                      </text>
                      <text
                        x={zone.bounds.x + zone.bounds.width / 2}
                        y={zone.bounds.y + zone.bounds.height / 2 + 8}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold pointer-events-none"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                      >
                        {zone.density}%
                      </text>
                    </g>
                  ))}
                  
                  {/* Camera Points */}
                  {cameras.map((camera) => (
                    <g key={camera.id}>
                      <circle
                        cx={camera.position.x}
                        cy={camera.position.y}
                        r="8"
                        fill={camera.status === 'online' ? '#10b981' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-10 transition-all"
                      />
                      <text
                        x={camera.position.x}
                        y={camera.position.y + 20}
                        textAnchor="middle"
                        className="fill-gray-700 text-xs font-medium"
                      >
                        📹
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getZoneColor('low') }}></div>
                  <span>Low (0-30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getZoneColor('medium') }}></div>
                  <span>Medium (30-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getZoneColor('high') }}></div>
                  <span>High (60-85%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getZoneColor('critical') }}></div>
                  <span>Critical (85%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Cameras</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Details Sidebar */}
        <div className="space-y-4">
          <Card className="shadow-glow border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-secondary font-bold">
                <MapPin className="h-5 w-5" />
                Zone Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedZone ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                    <Badge className={getStatusIcon(selectedZone.status)}>
                      {selectedZone.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Density:</span>
                      <span className="font-medium">{selectedZone.density}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Count:</span>
                      <span className="font-medium">{selectedZone.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{selectedZone.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Utilization:</span>
                      <span className="font-medium">
                        {Math.round((selectedZone.count / selectedZone.capacity) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last updated: {selectedZone.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a zone in the heatmap to view details
                </p>
              )}
            </CardContent>
          </Card>

          {/* Zone Summary */}
          <Card className="shadow-glow border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
            <CardHeader className="bg-gradient-to-r from-success/10 to-success/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-success font-bold">
                <Users className="h-5 w-5" />
                Zone Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.slice(0, 5).map((zone) => (
                <div 
                  key={zone.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getZoneColor(zone.status, 1) }}
                    ></div>
                    <span className="text-sm font-medium">{zone.name}</span>
                  </div>
                  <span className="text-sm font-bold">{zone.density}%</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Camera Status */}
          <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
            <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-warning font-bold">
                <Camera className="h-5 w-5" />
                Camera Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cameras.map((camera) => (
                <div key={camera.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{camera.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={camera.status === 'online' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {camera.status}
                    </Badge>
                    <span className="text-muted-foreground">{camera.viewCount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveHeatmapSVG;