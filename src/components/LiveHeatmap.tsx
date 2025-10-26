import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Thermometer, Users, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Rectangle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface HeatmapZone {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  density: number;
  count: number;
  capacity: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: Date;
}

interface CameraPoint {
  id: string;
  name: string;
  position: [number, number];
  status: 'online' | 'offline';
  viewCount: number;
}

const LiveHeatmap: React.FC = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [cameras, setCameras] = useState<CameraPoint[]>([]);
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);
  const [intensityRange, setIntensityRange] = useState([0, 100]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock temple coordinates (you can replace with actual coordinates)
  const templeCenter: [number, number] = [17.4065, 78.4772]; // Example: Hyderabad coordinates

  const generateMockData = (): HeatmapZone[] => {
    const baseZones = [
      { name: 'Main Temple', bounds: [[17.4060, 78.4765], [17.4070, 78.4780]] as [[number, number], [number, number]] },
      { name: 'Entry Gate A', bounds: [[17.4050, 78.4760], [17.4055, 78.4770]] as [[number, number], [number, number]] },
      { name: 'Entry Gate B', bounds: [[17.4075, 78.4775], [17.4080, 78.4785]] as [[number, number], [number, number]] },
      { name: 'Parking Area', bounds: [[17.4040, 78.4750], [17.4050, 78.4765]] as [[number, number], [number, number]] },
      { name: 'Food Court', bounds: [[17.4070, 78.4785], [17.4075, 78.4795]] as [[number, number], [number, number]] },
      { name: 'Rest Area', bounds: [[17.4055, 78.4795], [17.4065, 78.4805]] as [[number, number], [number, number]] },
      { name: 'Gift Shop', bounds: [[17.4065, 78.4750], [17.4070, 78.4760]] as [[number, number], [number, number]] },
      { name: 'Prayer Hall', bounds: [[17.4075, 78.4790], [17.4085, 78.4800]] as [[number, number], [number, number]] },
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
      { id: 'cam-1', name: 'Main Gate Camera', position: [17.4052, 78.4762], status: 'online', viewCount: 145 },
      { id: 'cam-2', name: 'Temple Entrance', position: [17.4065, 78.4772], status: 'online', viewCount: 234 },
      { id: 'cam-3', name: 'Parking Monitor', position: [17.4045, 78.4755], status: 'online', viewCount: 89 },
      { id: 'cam-4', name: 'Food Court View', position: [17.4072, 78.4790], status: 'offline', viewCount: 0 },
      { id: 'cam-5', name: 'Exit Monitor', position: [17.4077, 78.4782], status: 'online', viewCount: 156 },
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

  const refreshData = React.useCallback(() => {
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
      // throttle refresh to once per 60s to reduce CPU and network usage
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
        {/* Heatmap */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Live Crowd Density Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden border">
                {zones.length > 0 ? (
                  <MapContainer
                    center={templeCenter}
                    zoom={16}
                    style={{ height: '100%', width: '100%', minHeight: '500px' }}
                    zoomControl={true}
                    key={`map-${zones.length}`} // Force re-render when data changes
                  >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Heatmap Zones */}
                  {filteredZones.map((zone) => (
                    <Rectangle
                      key={zone.id}
                      bounds={zone.bounds}
                      pathOptions={{
                        fillColor: getZoneColor(zone.status, 0.6),
                        fillOpacity: 0.6,
                        color: getZoneColor(zone.status, 1),
                        weight: 2,
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{zone.name}</h3>
                          <p className="text-sm">Density: {zone.density}%</p>
                          <p className="text-sm">Count: {zone.count}/{zone.capacity}</p>
                          <Badge className={getStatusIcon(zone.status)}>
                            {zone.status.toUpperCase()}
                          </Badge>
                        </div>
                      </Popup>
                    </Rectangle>
                  ))}
                  
                  {/* Camera Points */}
                  {cameras.map((camera) => (
                    <Marker key={camera.id} position={camera.position}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{camera.name}</h3>
                          <p className="text-sm">Status: 
                            <Badge 
                              variant={camera.status === 'online' ? 'default' : 'destructive'}
                              className="ml-1"
                            >
                              {camera.status}
                            </Badge>
                          </p>
                          <p className="text-sm">Current View: {camera.viewCount} people</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p>Loading heatmap data...</p>
                    </div>
                  </div>
                )}
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
                  Click on a zone in the heatmap to view details
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

export default LiveHeatmap;