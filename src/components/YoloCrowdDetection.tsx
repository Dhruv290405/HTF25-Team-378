import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYoloCrowdData, yoloService } from '@/services/yoloService';
import { 
  Camera, 
  Users, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Settings, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface YoloCrowdDetectionProps {
  className?: string;
}

const YoloCrowdDetection: React.FC<YoloCrowdDetectionProps> = ({ className }) => {
  const { data, isLoading, error, refetch, testConnection, status } = useYoloCrowdData();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    const result = await testConnection();
    setConnectionStatus(result.success ? 'success' : 'failed');
    
    setTimeout(() => {
      setConnectionStatus('idle');
    }, 3000);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'testing': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return status.hasData ? 'bg-green-500' : 'bg-gray-400';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return status.hasData ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
    }
  };

  const getDensityLevel = (count: number) => {
    if (count >= 80) return { level: 'Critical', color: 'destructive', icon: AlertTriangle };
    if (count >= 50) return { level: 'High', color: 'secondary', icon: Activity };
    if (count >= 20) return { level: 'Medium', color: 'outline', icon: Users };
    return { level: 'Low', color: 'outline', icon: Users };
  };

  return (
    <div className={className}>
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-xl">AI Crowd Detection (YOLO v8)</CardTitle>
                <CardDescription>
                  Real-time people counting using computer vision
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`} />
              <span className="text-sm text-muted-foreground">
                {status.isPolling ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2">
              {getConnectionStatusIcon()}
              <span className="text-sm font-medium">
                {connectionStatus === 'testing' ? 'Testing connection...' :
                 connectionStatus === 'success' ? 'Connection successful' :
                 connectionStatus === 'failed' ? 'Connection failed' :
                 status.hasData ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={connectionStatus === 'testing'}>
                <Settings className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>YOLO Service Error:</strong> {error}
                <br />
                <span className="text-sm text-muted-foreground mt-1">
                  Displaying mock data. Check ngrok tunnel connection.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Crowd Data Display */}
          {data && (
            <div className="space-y-4">
              {/* Total Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {data.total_count}
                    </div>
                    <p className="text-sm text-muted-foreground">Total People</p>
                  </CardContent>
                </Card>

                {/* Left Side Count */}
                <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ArrowLeft className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {data.left_count}
                    </div>
                    <p className="text-sm text-muted-foreground">Left Side</p>
                  </CardContent>
                </Card>

                {/* Right Side Count */}
                <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ArrowRight className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {data.right_count}
                    </div>
                    <p className="text-sm text-muted-foreground">Right Side</p>
                  </CardContent>
                </Card>
              </div>

              {/* Density Analysis */}
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Crowd Distribution Analysis</h4>
                  <Badge variant={getDensityLevel(data.total_count).color as any}>
                    {getDensityLevel(data.total_count).level} Density
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">More people on:</span>
                    <Badge variant={data.more_people_side === 'equal' ? 'outline' : 'secondary'}>
                      {data.more_people_side === 'equal' ? 'Balanced' : 
                       data.more_people_side === 'left' ? 'Left Side' : 'Right Side'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Distribution ratio:</span>
                    <span className="text-sm font-mono">
                      {data.total_count > 0 ? 
                        `${Math.round((data.left_count / data.total_count) * 100)}% : ${Math.round((data.right_count / data.total_count) * 100)}%` : 
                        '0% : 0%'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last updated:</span>
                    <span className="text-sm text-muted-foreground">
                      {data.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Distribution */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="bg-blue-500 transition-all duration-300"
                        style={{
                          width: data.total_count > 0 ? `${(data.left_count / data.total_count) * 100}%` : '0%'
                        }}
                      />
                      <div 
                        className="bg-orange-500 transition-all duration-300"
                        style={{
                          width: data.total_count > 0 ? `${(data.right_count / data.total_count) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Left</span>
                    <span>Right</span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Ngrok URL:</strong> {status.ngrokUrl.replace('https://', '')}
                  </div>
                  <div>
                    <strong>Polling:</strong> {status.isPolling ? 'Active (5s)' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !data && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Connecting to YOLO service...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YoloCrowdDetection;
