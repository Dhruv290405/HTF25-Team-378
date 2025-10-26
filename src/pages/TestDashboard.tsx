import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, Thermometer, Video } from 'lucide-react';

const TestDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gradient mb-8">
          Enhanced Dashboard - Working Version
        </h1>
        
        {/* Enhanced Tab Navigation */}
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
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="heatmap"
              className="data-[state=active]:bg-warning data-[state=active]:text-white data-[state=active]:shadow-glow data-[state=active]:scale-105 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-warning/10"
            >
              <Thermometer className="w-4 h-4" />
              Heatmap
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-glow border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Overview Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">✅ Enhanced styling working!</p>
                  <p className="text-sm text-primary/70 mt-2">Gradient backgrounds, hover effects, and animations are all functioning properly.</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-glow border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10 hover:from-success/10 hover:to-success/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-success">Stats & Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                    1,234
                  </div>
                  <p className="text-sm text-success/70 mt-2">Sample enhanced metric display</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 hover:from-warning/10 hover:to-warning/15 hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-warning">Live Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">All Systems Online</p>
                  <p className="text-sm text-warning/70 mt-2">Real-time monitoring active</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-glow border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-secondary font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg">📊 Analytics section with enhanced styling</p>
                <p className="text-sm text-muted-foreground mt-2">This demonstrates the enhanced visual design without complex components that might cause issues.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card className="shadow-glow border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
              <CardHeader className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-t-lg">
                <CardTitle className="text-warning font-bold flex items-center gap-2">
                  <Thermometer className="w-6 h-6" />
                  Live Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg">🗺️ Heatmap visualization area</p>
                <p className="text-sm text-muted-foreground mt-2">Enhanced visual styling for crowd density mapping</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <Card className="shadow-glow border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
              <CardHeader className="bg-gradient-to-r from-success/10 to-success/5 rounded-t-lg">
                <CardTitle className="text-success font-bold flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg">📹 Live camera feeds and monitoring</p>
                <p className="text-sm text-muted-foreground mt-2">Real-time surveillance and crowd detection display</p>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default TestDashboard;