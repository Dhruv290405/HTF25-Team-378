import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  TrendingUp, 
  Thermometer, 
  Video,
  ChevronRight 
} from 'lucide-react';

interface SectionNavigatorProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const getActiveClasses = (color: string) => {
    const classes = {
      primary: 'bg-primary text-white shadow-glow scale-105',
      secondary: 'bg-secondary text-white shadow-glow scale-105',
      warning: 'bg-warning text-white shadow-glow scale-105',
      success: 'bg-success text-white shadow-glow scale-105'
    };
    return classes[color as keyof typeof classes] || classes.primary;
  };

  const getHoverClasses = (color: string) => {
    const classes = {
      primary: 'hover:bg-primary/10 hover:text-primary',
      secondary: 'hover:bg-secondary/10 hover:text-secondary',
      warning: 'hover:bg-warning/10 hover:text-warning',
      success: 'hover:bg-success/10 hover:text-success'
    };
    return classes[color as keyof typeof classes] || classes.primary;
  };

  const getIconClasses = (color: string, isActive: boolean) => {
    if (isActive) return 'bg-white/20';
    
    const classes = {
      primary: 'bg-primary/20',
      secondary: 'bg-secondary/20',
      warning: 'bg-warning/20',
      success: 'bg-success/20'
    };
    return classes[color as keyof typeof classes] || classes.primary;
  };

  const sections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
      color: 'primary',
      description: 'System stats and live monitoring'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      color: 'secondary',
      description: 'Advanced insights and predictions'
    },
    {
      id: 'heatmap',
      label: 'Heatmap',
      icon: Thermometer,
      color: 'warning',
      description: 'Real-time crowd density visualization'
    },
    {
      id: 'live',
      label: 'Live Monitoring',
      icon: Video,
      color: 'success',
      description: 'Camera feeds and AI detection'
    }
  ];

  return (
    <Card className="fixed bottom-6 right-6 z-50 shadow-glow border-2 border-primary/20 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm max-w-sm">
      <CardContent className="p-4">
        <h3 className="font-bold text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          Quick Navigation
        </h3>
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onSectionChange(section.id)}
                className={`w-full justify-start text-left p-3 h-auto transition-all duration-300 ${
                  isActive 
                    ? getActiveClasses(section.color) 
                    : getHoverClasses(section.color)
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-1 rounded-full ${getIconClasses(section.color, isActive)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{section.label}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-white/80' : 'text-muted-foreground'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionNavigator;