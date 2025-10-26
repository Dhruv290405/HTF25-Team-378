import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/translations';
import { CreditCard, Shield, Users } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'pilgrim' | 'authority'>('pilgrim');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, language, user } = useAuth();
  const navigate = useNavigate();
  const t = useTranslation(language);

  // Don't auto-redirect - let users choose to logout or switch roles
  // useEffect(() => {
  //   if (user) {
  //     console.log('🔄 useEffect: User already authenticated:', user.name, user.role);
  //     if (user.role === 'authority' || user.role === 'admin') {
  //       console.log('🛡️ useEffect: Redirecting to Authority Dashboard');
  //       navigate('/authority');
  //     } else {
  //       console.log('🙏 useEffect: Redirecting to Pilgrim Portal');
  //       navigate('/pilgrim');
  //     }
  //   }
  // }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    
    console.log('🔍 Login attempt:', {
      rawAadhaar: aadhaar,
      cleanAadhaar: cleanAadhaar,
      length: cleanAadhaar.length,
      name: name,
      role: role
    });
    
    if (!cleanAadhaar || cleanAadhaar.length !== 12) {
      const message = language === 'en' 
        ? `Please enter a valid 12-digit Aadhaar number. You entered: ${cleanAadhaar} (${cleanAadhaar.length} digits)` 
        : `कृपया एक वैध 12 अंकों का आधार नंबर दर्ज करें। आपने दर्ज किया: ${cleanAadhaar} (${cleanAadhaar.length} अंक)`;
      alert(message);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the database authentication
      const success = await login(cleanAadhaar);
      
      if (success) {
        console.log('✅ Login successful, checking user role...');
        
        // Small delay to ensure user state is updated
        setTimeout(() => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          console.log('🔍 Current user from localStorage:', currentUser);
          console.log('🔍 User role:', currentUser.role);
          
          if (currentUser.role === 'authority' || currentUser.role === 'admin') {
            console.log('🛡️ Redirecting to Authority Dashboard');
            navigate('/authority');
          } else {
            console.log('🙏 Redirecting to Pilgrim Portal');
            navigate('/pilgrim');
          }
        }, 100);
      } else {
        const availableAccounts = [
          '123456789012 - Ram Kumar (Pilgrim)',
          '123456789013 - Sita Devi (Pilgrim)',
          '123456789014 - Admin Officer (Authority)',
          '123456789015 - Crowd Manager (Authority)',
          '123456789016 - Priya Sharma (Pilgrim)'
        ];
        
        alert(language === 'en' 
          ? `Invalid Aadhaar: ${cleanAadhaar}\n\nAvailable demo accounts:\n\n${availableAccounts.join('\n')}` 
          : `अमान्य आधार: ${cleanAadhaar}\n\nउपलब्ध डेमो खाते:\n\n${availableAccounts.join('\n')}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(language === 'en' 
        ? 'Login failed. Please try again.' 
        : 'लॉगिन विफल। कृपया पुन: प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gradient">TRINETRA</h1>
              <span className="ml-2 text-sm text-muted-foreground">Login Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary">Home</a>
              <a href="/pilgrim" className="text-sm text-muted-foreground hover:text-primary">Pilgrim Demo</a>
              <a href="/authority" className="text-sm text-muted-foreground hover:text-primary">Authority Demo</a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-large border-0">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 gradient-spiritual rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">
              {t('welcomeBack')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('enterMobile')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Current User Status */}
            {user && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">
                      ✅ {language === 'en' ? 'Currently logged in as:' : 'वर्तमान में लॉग इन:'}
                    </p>
                    <p className="text-green-700 text-sm">
                      👤 {user.name} ({user.role === 'authority' ? (language === 'en' ? 'Authority' : 'प्राधिकरण') : (language === 'en' ? 'Pilgrim' : 'तीर्थयात्री')})
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    {language === 'en' ? 'Logout' : 'लॉग आउट'}
                  </Button>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate(user.role === 'authority' ? '/authority' : '/pilgrim')}
                    className="flex-1"
                  >
                    {language === 'en' ? 'Go to Dashboard' : 'डैशबोर्ड पर जाएं'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    {language === 'en' ? 'Home' : 'होम'}
                  </Button>
                </div>
                <hr className="my-4" />
                <p className="text-center text-sm text-muted-foreground">
                  {language === 'en' ? 'Or login with a different account:' : 'या किसी अन्य खाते से लॉगिन करें:'}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {language === 'en' ? 'Full Name' : 'पूरा नाम'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Aadhaar Number Input */}
              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="text-sm font-medium">
                  {language === 'en' ? 'Aadhaar Number' : 'आधार संख्या'}
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="1234 5678 9012"
                    value={aadhaar}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setAadhaar(formatted);
                    }}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'en' ? '12-digit Aadhaar number' : '12 अंकों की आधार संख्या'}
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('selectRole')}</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'pilgrim' | 'authority')}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value="pilgrim" id="pilgrim" />
                    <div className="flex items-center space-x-3 flex-1">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <Label htmlFor="pilgrim" className="font-medium cursor-pointer">
                          {t('pilgrim')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' ? 'For pilgrims visiting Mahakumbh' : 'महाकुंभ में आने वाले यात्रियों के लिए'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value="authority" id="authority" />
                    <div className="flex items-center space-x-3 flex-1">
                      <Shield className="w-5 h-5 text-secondary" />
                      <div>
                        <Label htmlFor="authority" className="font-medium cursor-pointer">
                          {t('authority')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {language === 'en' ? 'For authorized personnel and administrators' : 'अधिकृत कर्मचारियों और प्रशासकों के लिए'}
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant={role === 'pilgrim' ? 'hero' : 'authority'}
                className="w-full"
                disabled={!aadhaar || aadhaar.replace(/\s/g, '').length !== 12 || !name.trim() || isLoading}
              >
                {isLoading ? t('loading') : t('signIn')}
              </Button>
            </form>

            {/* Demo Instructions */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-3">
                {language === 'en' 
                  ? 'Quick Demo Login - Click to auto-fill'
                  : 'तेज़ डेमो लॉगिन - ऑटो-फ़िल के लिए क्लिक करें'
                }
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setAadhaar('1234 5678 9012');
                    setName('Ram Kumar');
                    setRole('pilgrim');
                  }}
                  className="text-xs justify-start"
                >
                  🙏 Ram Kumar (Pilgrim) - 123456789012
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setAadhaar('1234 5678 9014');
                    setName('Admin Officer');
                    setRole('authority');
                  }}
                  className="text-xs justify-start"
                >
                  🛡️ Admin Officer (Authority) - 123456789014
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setAadhaar('1234 5678 9015');
                    setName('Crowd Manager');
                    setRole('authority');
                  }}
                  className="text-xs justify-start"
                >
                  📈 Crowd Manager (Authority) - 123456789015
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;