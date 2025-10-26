import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

interface VoiceToTextProps {
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ 
  onTextChange,
  placeholder 
}) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const latestTextRef = useRef(text);

  const { speak, cancel, speaking } = useSpeechSynthesis();
  
  const onRecognitionResult = useCallback((result: string) => {
    setText(prev => {
      const next = (prev ? prev + ' ' : '') + result;
      latestTextRef.current = next;
      if (onTextChange) onTextChange(next);
      return next;
    });
  }, [onTextChange]);

  const onRecognitionEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: onRecognitionResult,
    onEnd: onRecognitionEnd,
  });

  const handleStartListening = () => {
    if (supported) {
      setIsListening(true);
      // Use one-shot listening to reduce CPU and avoid long-running continuous recognition
      listen({
        continuous: false,
        interimResults: false,
        lang: 'en-US', // consider making this dynamic
      });
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
    stop();
  };

  const handleSpeak = () => {
    if (text.trim()) {
      speak({ text });
    }
  };

  const handleStopSpeaking = () => {
    cancel();
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  useEffect(() => {
    latestTextRef.current = text;
  }, [text]);

  if (!supported) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            {t('voice.notSupported')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          {t('pilgrim.speakToText')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder || t('chatbot.placeholder')}
          className="min-h-[100px]"
        />
        
        <div className="flex gap-2">
          {!isListening ? (
            <Button 
              onClick={handleStartListening}
              className="gap-2"
              variant="default"
            >
              <Mic className="h-4 w-4" />
              {t('voice.startListening')}
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              className="gap-2"
              variant="destructive"
            >
              <MicOff className="h-4 w-4" />
              {t('voice.stopListening')}
            </Button>
          )}
          
          {!speaking ? (
            <Button 
              onClick={handleSpeak}
              className="gap-2"
              variant="outline"
              disabled={!text.trim()}
            >
              <Volume2 className="h-4 w-4" />
              {t('voice.speak')}
            </Button>
          ) : (
            <Button 
              onClick={handleStopSpeaking}
              className="gap-2"
              variant="outline"
            >
              <VolumeX className="h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            {t('chatbot.listening')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceToText;