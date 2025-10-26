import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
const VoiceToText = React.lazy(() => import('@/components/VoiceToText'));
const AIChatbot = React.lazy(() => import('@/components/AIChatbot'));
import { generatePass, getUserPasses, getUserPenalties, type Pass, type Penalty, type GroupMember } from '@/services/mockData';
import { QrCode, CreditCard, Download, Clock, MapPin, AlertTriangle, CheckCircle, Plus, Users } from 'lucide-react';
import GroupBookingForm from '@/components/GroupBookingForm';
import { toast } from '@/hooks/use-toast';

const PilgrimPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const language = (i18n?.language as 'en' | 'hi' | 'te') || 'en';
  const [passes, setPasses] = useState<Pass[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('passes');
  const [zones, setZones] = useState<{ id: string; name: string; maxCapacity: number }[]>([]);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      // Use user ID if available, otherwise use demo ID
      const userId = user?.id || 'demo-user';
      const [userPasses, userPenalties] = await Promise.all([
        getUserPasses(userId),
        getUserPenalties(userId)
      ]);
      
      // Mock zones data
      const mockZones = [
        { id: 'zone_1', name: 'Sangam Ghat', maxCapacity: 15000 },
        { id: 'zone_2', name: 'Akshaya Vat', maxCapacity: 10000 },
        { id: 'zone_3', name: 'Hanuman Temple', maxCapacity: 8000 },
        { id: 'zone_4', name: 'Patalpuri Temple', maxCapacity: 5000 },
        { id: 'zone_5', name: 'Saraswati Koop', maxCapacity: 10000 }
      ];
      
      setPasses(userPasses);
      setPenalties(userPenalties);
      setZones(mockZones);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: t('error'),
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    // Load data regardless of user (for demo mode)
    loadUserData();
  }, [loadUserData]);

  const handleBookPass = async (groupMembers: GroupMember[], tentCityDays?: number) => {
    if (!selectedZone) return;
    
    setBookingLoading(true);
    const zone = zones.find(z => z.id === selectedZone);
    
    try {
      if (zone) {
        const newPass = generatePass(
          user.id, 
          zone.id, 
          zone.name, 
          groupMembers, 
          tentCityDays
        );
        setPasses(prev => [...prev, newPass]);
        
        toast({
          title: t('success'),
          description: `${t('passBooked')} - Group of ${groupMembers.length} members`,
          variant: 'default',
        });
        
        setSelectedZone('');
      }
    } catch (error) {
      console.error('Failed to book pass:', error);
      toast({
        title: t('error'),
        description: 'Failed to book pass',
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-success text-success-foreground">Active</Badge>;
      case 'used':
        return <Badge variant="outline">Used</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const generateQRCode = (passId: string) => {
    // In a real app, this would generate an actual QR code
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23000'/><rect x='20' y='20' width='160' height='160' fill='%23fff'/><text x='100' y='110' text-anchor='middle' fill='%23000' font-size='12'>QR: ${passId}</text></svg>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gradient">TRINETRA</h1>
              <span className="text-sm text-muted-foreground">Pilgrim Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary">Home</a>
              <a href="/authority" className="text-sm text-muted-foreground hover:text-primary">Authority Dashboard</a>
              {user && (
                <>
                  <span className="text-sm font-medium text-primary">🙏 {user.name} ({user.role})</span>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {t('pilgrim.welcome')} {!user && <Badge variant="secondary" className="ml-2">Demo Mode</Badge>}
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your digital passes, get AI assistance, and stay updated on your pilgrimage journey
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                🌟 <strong>Demo Mode:</strong> You're viewing the Pilgrim Portal without authentication. 
                <a href="/login" className="underline ml-1">Login</a> for full functionality.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="passes">{t('pilgrim.passes')}</TabsTrigger>
            <TabsTrigger value="book">Book Pass</TabsTrigger>
            <TabsTrigger value="voice">{t('pilgrim.voiceAssistant')}</TabsTrigger>
            <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
            <TabsTrigger value="penalties">Penalties</TabsTrigger>
          </TabsList>

          {/* My Passes Tab */}
          <TabsContent value="passes" className="space-y-6">
            {passes.length === 0 ? (
              <Card className="shadow-medium">
                <CardContent className="p-8 text-center">
                  <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('pilgrim.noPasses')}</h3>
                  <p className="text-muted-foreground mb-4">{t('pilgrim.noPassesDesc')}</p>
                  <Button variant="hero" onClick={() => setActiveTab('book')}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('bookPass')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {passes.map((pass) => (
                  <Card key={pass.id} className="shadow-medium hover:shadow-large transition-smooth">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pass.zoneName}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            Zone {pass.zoneId.split('_')[1]}
                          </CardDescription>
                        </div>
                        {getStatusBadge(pass.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            {t('pilgrim.entryLabel')} {pass.entryTime ? new Date(pass.entryTime).toLocaleString() : t('common.loading')}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            {t('pilgrim.exitDeadlineLabel')} {new Date(pass.exitDeadline).toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            {t('pilgrim.groupSizeLabel')} {pass.groupSize} {t('pilgrim.members')}
                          </div>
                          {pass.extraCharges && pass.extraCharges > 0 && (
                            <div className="flex items-center text-sm text-warning">
                              <CreditCard className="w-4 h-4 mr-2" />
                              {t('pilgrim.tentCity')} ₹{pass.extraCharges} {t('pilgrim.charged')}
                            </div>
                          )}
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <QrCode className="w-4 h-4 mr-2" />
                              {t('viewPass')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{pass.zoneName} - Digital Group Pass</DialogTitle>
                              <DialogDescription>
                                Group of {pass.groupSize} members • Scan at entry point
                              </DialogDescription>
                            </DialogHeader>
                            <div className="text-center space-y-4">
                              <img
                                src={generateQRCode(pass.id)}
                                alt="QR Code"
                                className="mx-auto border rounded-lg"
                              />
                              <div className="space-y-2 text-sm">
                                <div className="font-medium">Pass ID: {pass.id}</div>
                                <div className="text-muted-foreground">
                                  Valid until: {pass.exitDeadline.toLocaleString()}
                                </div>
                                <div className="text-muted-foreground">
                                  Members: {pass.groupMembers.map(m => m.name).join(', ')}
                                </div>
                              </div>
                              <Button variant="outline" className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                {t('downloadPass')}
                              </Button>
                            </div>
                          </DialogContent>
                         </Dialog>
                     </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Book Pass Tab */}
          <TabsContent value="book" className="space-y-6">
            <GroupBookingForm
              onBookPass={handleBookPass}
              selectedZone={selectedZone}
              onZoneChange={setSelectedZone}
              zones={zones.map(z => ({ zoneId: z.id, zoneName: z.name, currentCount: 0, maxCapacity: z.maxCapacity, density: 0, status: 'normal' as const, lastUpdated: new Date() }))}
              isLoading={bookingLoading}
              language={language}
            />
          </TabsContent>

          {/* Penalties Tab */}
          <TabsContent value="penalties" className="space-y-6">
            {penalties.length === 0 ? (
              <Card className="shadow-medium">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'en' ? 'No Penalties' : 'कोई जुर्माना नहीं'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? 'You have no outstanding penalties. Keep following the guidelines!'
                      : 'आपके पास कोई बकाया जुर्माना नहीं है। दिशानिर्देशों का पालन करते रहें!'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {penalties.map((penalty) => (
                  <Card key={penalty.id} className="shadow-medium">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                          <div>
                            <h4 className="font-semibold">{penalty.reason}</h4>
                            <p className="text-sm text-muted-foreground">
                              Issued: {penalty.dateIssued.toLocaleDateString()} • Pass: {penalty.passId}
                            </p>
                            {penalty.overstayHours > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Overstay: {penalty.overstayHours} hours
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{penalty.amount}</div>
                          <Badge variant={
                            penalty.status === 'paid' ? 'secondary' : 
                            penalty.status === 'auto_deducted' ? 'outline' : 
                            'destructive'
                          }>
                            {penalty.status === 'paid' ? 'Paid' : 
                             penalty.status === 'auto_deducted' ? 'Auto Deducted' : 
                             'Pending'}
                          </Badge>
                          {penalty.smsAlertSent && (
                            <p className="text-xs text-muted-foreground mt-1">SMS Sent</p>
                          )}
                        </div>
                      </div>
                      {penalty.status === 'pending' && (
                        <div className="mt-4">
                          <Button variant="warning" size="sm">
                            Pay Now
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Voice Assistant Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<div className="p-4">Loading voice assistant...</div>}>
                <VoiceToText 
                  onTextChange={(text) => console.log('Voice input:', text)}
                  placeholder={t('chatbot.placeholder')}
                />
              </Suspense>
              <Card>
                <CardHeader>
                  <CardTitle>{t('pilgrim.help')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your voice to:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Ask about crowd status</li>
                    <li>• Get directions</li>
                    <li>• Check pass information</li>
                    <li>• Find facilities</li>
                    <li>• Emergency assistance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Chatbot Tab */}
          <TabsContent value="chatbot" className="space-y-6">
            <Suspense fallback={<div className="p-4">Loading AI assistant...</div>}>
              <AIChatbot />
            </Suspense>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default PilgrimPortal;