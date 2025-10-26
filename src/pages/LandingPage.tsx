import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/translations';
import { QrCode, Users, Globe, Shield, Zap, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/mahakumbh-hero.jpg';

const LandingPage: React.FC = () => {
  const { language } = useAuth();
  const t = useTranslation(language);

  const features = [
    {
      icon: QrCode,
      title: t('digitalPass'),
      description: t('digitalPassDesc'),
    },
    {
      icon: BarChart3,
      title: t('crowdMonitoring'),
      description: t('crowdMonitoringDesc'),
    },
    {
      icon: Globe,
      title: t('multiLanguage'),
      description: t('multiLanguageDesc'),
    },
  ];

  const stats = [
    { label: language === 'en' ? 'Expected Pilgrims' : 'अपेक्षित यात्री', value: '40 Crore', icon: Users },
    { label: language === 'en' ? 'Sacred Zones' : 'पवित्र क्षेत्र', value: '12+', icon: Shield },
    { label: language === 'en' ? 'Digital Passes' : 'डिजिटल पास', value: '100%', icon: QrCode },
    { label: language === 'en' ? 'Real-time Updates' : 'रियल-टाइम अपडेट', value: '24/7', icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gradient">TRINETRA</h1>
              <span className="ml-2 text-sm text-muted-foreground">Smart Crowd Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/test">
                <Button variant="ghost" size="sm">Test</Button>
              </Link>
              <Link to="/pilgrim">
                <Button variant="ghost" size="sm">Pilgrim Demo</Button>
              </Link>
              <Link to="/authority">
                <Button variant="ghost" size="sm">Authority Demo</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Mahakumbh 2028"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('heroTitle')}
            <br />
            <span className="text-accent text-3xl md:text-5xl lg:text-6xl">
              {t('heroSubtitle')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="hero" size="lg" className="min-w-48">
                {t('getStarted')}
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="min-w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              {t('learnMore')}
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 gradient-spiritual rounded-full">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              {language === 'en' ? 'Smart Features for Sacred Journey' : 'पवित्र यात्रा के लिए स्मार्ट सुविधाएं'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Advanced technology ensuring safe, organized, and spiritual experience for millions of pilgrims'
                : 'करोड़ों तीर्थयात्रियों के लिए सुरक्षित, व्यवस्थित और आध्यात्मिक अनुभव सुनिश्चित करने वाली उन्नत तकनीक'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-medium hover:shadow-large transition-smooth border-0">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 gradient-spiritual rounded-full mx-auto">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Portal Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              {language === 'en' ? 'Access Your Portal' : 'अपना पोर्टल एक्सेस करें'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Choose your role to access the appropriate dashboard'
                : 'उपयुक्त डैशबोर्ड तक पहुंचने के लिए अपनी भूमिका चुनें'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  {language === 'en' ? '🙏 Pilgrim Portal' : '🙏 तीर्थयात्री पोर्टल'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-6">
                  {language === 'en' 
                    ? 'Digital passes, group booking, AI assistance, and spiritual journey management'
                    : 'डिजिटल पास, समूह बुकिंग, एआई सहायता, और आध्यात्मिक यात्रा प्रबंधन'
                  }
                </CardDescription>
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3">
                      {language === 'en' ? 'Login as Pilgrim' : 'तीर्थयात्री के रूप में लॉगिन'}
                    </Button>
                  </Link>
                  <Link to="/pilgrim" className="block">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                      {language === 'en' ? 'Demo Portal' : 'डेमो पोर्टल'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-purple-600">
                  {language === 'en' ? '🛡️ Authority Dashboard' : '🛡️ प्राधिकरण डैशबोर्ड'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-6">
                  {language === 'en' 
                    ? 'Live monitoring, crowd analytics, AI-powered insights, and management tools'
                    : 'लाइव निगरानी, भीड़ विश्लेषण, एआई-संचालित अंतर्दृष्टि, और प्रबंधन उपकरण'
                  }
                </CardDescription>
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3">
                      {language === 'en' ? 'Login as Authority' : 'प्राधिकरण के रूप में लॉगिन'}
                    </Button>
                  </Link>
                  <Link to="/authority" className="block">
                    <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                      {language === 'en' ? 'Demo Dashboard' : 'डेमो डैशबोर्ड'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">
                  {language === 'en' ? '🔐 Login System' : '🔐 लॉगिन सिस्टम'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-6">
                  {language === 'en' 
                    ? 'Secure Aadhaar-based authentication with role-based access control'
                    : 'भूमिका-आधारित पहुंच नियंत्रण के साथ सुरक्षित आधार-आधारित प्रमाणीकरण'
                  }
                </CardDescription>
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3">
                      {language === 'en' ? 'Go to Login' : 'लॉगिन पर जाएं'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'en' 
              ? 'Ready to Experience the Future of Pilgrimage?' 
              : 'तीर्थयात्रा के भविष्य का अनुभव करने के लिए तैयार हैं?'
            }
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'en'
              ? 'Join millions of pilgrims in the most organized and safe Mahakumbh experience ever.'
              : 'सबसे व्यवस्थित और सुरक्षित महाकुंभ अनुभव में करोड़ों तीर्थयात्रियों के साथ जुड़ें।'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="secondary" size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20 text-white min-w-48">
                {language === 'en' ? 'Get Started Now' : 'अभी शुरू करें'}
              </Button>
            </Link>
            <Link to="/pilgrim">
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 min-w-48">
                {language === 'en' ? 'Try Demo' : 'डेमो देखें'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;