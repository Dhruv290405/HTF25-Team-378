import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/translations';
import { Phone, Shield, Users } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'pilgrim' | 'authority'>('pilgrim');
  const [isLoading, setIsLoading] = useState(false);
  const { login, language } = useAuth();
  const navigate = useNavigate();
  const t = useTranslation(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length !== 10) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(mobile, role);
      setIsLoading(false);
      
      // Redirect based on role
      if (role === 'pilgrim') {
        navigate('/pilgrim');
      } else {
        navigate('/authority');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mobile Number Input */}
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  {t('mobileNumber')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10"
                    required
                  />
                </div>
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
                disabled={!mobile || mobile.length !== 10 || isLoading}
              >
                {isLoading ? t('loading') : t('signIn')}
              </Button>
            </form>

            {/* Demo Instructions */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                {language === 'en' 
                  ? 'Demo: Enter any 10-digit number to proceed'
                  : 'डेमो: आगे बढ़ने के लिए कोई भी 10 अंकों का नंबर दर्ज करें'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;