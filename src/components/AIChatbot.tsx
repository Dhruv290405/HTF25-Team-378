import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIResponseData {
  response: string;
  suggestions?: string[];
}

const AIchatbot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: t('chatbot.welcome'),
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { speak } = useSpeechSynthesis();

  // Mock AI responses based on language and content
  const getAIResponse = async (userMessage: string): Promise<AIResponseData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    const currentLang = i18n.language;
    
    // Context-aware responses
    if (lowerMessage.includes('crowd') || lowerMessage.includes('भीड़') || lowerMessage.includes('గుంపు')) {
      return {
        response: currentLang === 'hi' 
          ? 'वर्तमान में मुख्य क्षेत्रों में भीड़ का स्तर मध्यम है। क्या आप किसी विशिष्ट क्षेत्र के बारे में जानना चाहते हैं?'
          : currentLang === 'te'
          ? 'ప్రస్తుతం ప్రధान ప్రాంతాలలో గుంపు స్థాయి మధ్యమంగా ఉంది. మీరు ఏదైనా నిర్దిష్ట ప్రాంతం గురించి తెలుసుకోవాలనుకుంటున్నారా?'
          : 'Current crowd levels in main areas are moderate. Would you like to know about any specific zone?',
        suggestions: currentLang === 'hi' 
          ? ['मुख्य मंदिर क्षेत्र', 'प्रवेश द्वार', 'पार्किंग क्षेत्र']
          : currentLang === 'te'
          ? ['ప్రధాన దేవాలయ ప్రాంతం', 'ప్రవేశ ద్వారం', 'పార్కింగ్ ప్రాంతం']
          : ['Main temple area', 'Entry gates', 'Parking area']
      };
    }
    
    if (lowerMessage.includes('pass') || lowerMessage.includes('पास') || lowerMessage.includes('పాస్')) {
      return {
        response: currentLang === 'hi'
          ? 'आपका पास स्टेटस सक्रिय है। यह कल तक वैध है। क्या आपको पास नवीनीकरण के बारे में जानकारी चाहिए?'
          : currentLang === 'te'
          ? 'మీ పాస్ స్థితి సక్రియంగా ఉంది. ఇది రేపు వరకు చెల్లుబాటు అవుతుంది. మీకు పాస్ పునరుద్ధరణ గురించి సమాచారం కావాలా?'
          : 'Your pass status is active. It\'s valid until tomorrow. Do you need information about pass renewal?',
        suggestions: currentLang === 'hi'
          ? ['पास नवीनीकरण', 'पास का इतिहास', 'नया पास']
          : currentLang === 'te'
          ? ['పాస్ పునరుద్ధరణ', 'పాస్ చరిత్ర', 'కొత్త పాస్']
          : ['Renew pass', 'Pass history', 'New pass']
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('सहायता') || lowerMessage.includes('సహాయం')) {
      return {
        response: currentLang === 'hi'
          ? 'मैं आपकी निम्नलिखित में सहायता कर सकता हूं:\n• भीड़ की जानकारी\n• पास प्रबंधन\n• नेविगेशन\n• आपातकालीन संपर्क\n• सुविधाओं की जानकारी'
          : currentLang === 'te'
          ? 'నేను మీకు ఈ విషయాలలో సహాయం చేయగలను:\n• గుంపు సమాచారం\n• పాస్ నిర్వహణ\n• నావిగేషన్\n• అత్యవసర సంప్రదింపులు\n• సౌకర్యాల సమాచారం'
          : 'I can help you with:\n• Crowd information\n• Pass management\n• Navigation\n• Emergency contacts\n• Facility information',
        suggestions: currentLang === 'hi'
          ? ['भीड़ की स्थिति', 'आपातकालीन संपर्क', 'सुविधाएं']
          : currentLang === 'te'
          ? ['గుంపు స్థితి', 'అత్యవసర సంప్రदింపు', 'సౌకర్యాలు']
          : ['Crowd status', 'Emergency contacts', 'Facilities']
      };
    }
    
    // Default response
    return {
      response: currentLang === 'hi'
        ? 'मैं आपकी मदद करने के लिए यहां हूं। कृपया अपना प्रश्न पूछें या सुझावों में से चुनें।'
        : currentLang === 'te'
        ? 'నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. దయచేసి మీ ప్రశ్న అడగండి లేదా సూచనలలో నుండి ఎంచుకోండి.'
        : 'I\'m here to help you. Please ask your question or choose from the suggestions.',
      suggestions: currentLang === 'hi'
        ? ['भीड़ की जानकारी', 'मेरा पास', 'सहायता']
        : currentLang === 'te'
        ? ['గుంపు సమాచారం', 'నా పాస్', 'సహాయం']
        : ['Crowd info', 'My pass', 'Help']
    };
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => {
      const next = [...prev, userMessage];
      // keep last 50 messages to avoid unbounded growth
      return next.slice(-50);
    });
    setInputText('');
    setIsLoading(true);
    
    try {
      const aiResponse = await getAIResponse(content);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse.response,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const next = [...prev, botMessage];
        return next.slice(-50);
      });
      
      // Speak the response if it's not too long
      if (aiResponse.response.length < 200) {
        speak({ text: aiResponse.response });
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: t('common.error'),
        timestamp: new Date()
      };
      setMessages(prev => {
        const next = [...prev, errorMessage];
        return next.slice(-50);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRecognitionResult = (result: string) => {
    setInputText(result);
    setIsListening(false);
  };

  const { listen, stop, supported } = useSpeechRecognition({
    onResult: onRecognitionResult,
  });

  const handleVoiceInput = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      listen({ continuous: false, interimResults: false });
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {t('chatbot.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder')}
            disabled={isLoading}
            className="flex-1"
          />
          
          {supported && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-600" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            onClick={() => sendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isListening && (
          <div className="text-sm text-blue-600 flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            {t('chatbot.listening')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIchatbot;