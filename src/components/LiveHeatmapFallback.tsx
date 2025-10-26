import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Thermometer, Users, RefreshCw, AlertTriangle } from 'lucide-react';

interface HeatmapZone {
  id: string;
  name: string;
  density: number;
  count: number;
  capacity: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: Date;
}

interface CameraPoint {
  id: string;
  name: string;
  status: 'online' | 'offline';
  viewCount: number;
}

const LiveHeatmapFallback: React.FC = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [cameras, setCameras] = useState<CameraPoint[]>([]);
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);
  const [intensityRange, setIntensityRange] = useState([0, 100]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateMockData = (): HeatmapZone[] => {
    const baseZones = [
      'Main Temple', 'Entry Gate A', 'Entry Gate B', 'Parking Area',
      'Food Court', 'Rest Area', 'Gift Shop', 'Prayer Hall'
    ];

    return baseZones.map((name, index) => {
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
        name,
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
      { id: 'cam-1', name: 'Main Gate Camera', status: 'online', viewCount: 145 },
      { id: 'cam-2', name: 'Temple Entrance', status: 'online', viewCount: 234 },
      { id: 'cam-3', name: 'Parking Monitor', status: 'online', viewCount: 89 },
      { id: 'cam-4', name: 'Food Court View', status: 'offline', viewCount: 0 },
      { id: 'cam-5', name: 'Exit Monitor', status: 'online', viewCount: 156 },
    ];
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
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
        {/* Heatmap Placeholder */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Live Crowd Density Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg border bg-muted/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 mx-auto text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Interactive Map Loading</h3>
                    <p className="text-muted-foreground">
                      The interactive map component is being optimized for better performance.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      View zone data in the sidebar for real-time crowd information.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span>Low (0-30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span>Medium (30-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span>High (60-85%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-800"></div>
                  <span>Critical (85%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Cameras</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Details Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone Details</CardTitle>
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
                  Click on a zone below to view details
                </p>
              )}
            </CardContent>
          </Card>

          {/* Zone Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredZones.slice(0, 8).map((zone) => (
                <div 
                  key={zone.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        zone.status === 'low' ? 'bg-green-500' :
                        zone.status === 'medium' ? 'bg-orange-500' :
                        zone.status === 'high' ? 'bg-red-500' : 'bg-red-800'
                      }`}
                    ></div>
                    <span className="text-sm font-medium">{zone.name}</span>
                  </div>
                  <span className="text-sm font-bold">{zone.density}%</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Camera Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Camera Status</CardTitle>
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

export default LiveHeatmapFallback;