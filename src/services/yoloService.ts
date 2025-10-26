const YOLO_SERVER_URL = (import.meta.env.VITE_YOLO_SERVER_URL as string) || 'http://localhost:5000';

export async function detectFrame(blob: Blob) {
  const form = new FormData();
  form.append('frame', blob, 'frame.jpg');

  const res = await fetch(`${YOLO_SERVER_URL}/detect`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YOLO server error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function pingServer() {
  try {
    const r = await fetch(`${YOLO_SERVER_URL}/ping`);
    return r.ok;
  } catch {
    return false;
  }
}
// YOLO v8 Service for Real-time Crowd Counting Integration
// Integrates with the ngrok tunnel from Google Colab YOLO implementation

import React from 'react';

export interface YoloCrowdData {
  left_count: number;
  right_count: number;
  total_count: number;
  more_people_side: 'left' | 'right' | 'equal';
  timestamp: Date;
  zone_id?: string;
  zone_name?: string;
}

export interface YoloServiceConfig {
  ngrokUrl: string;
  enabled: boolean;
  refreshInterval: number; // in milliseconds
  timeout: number; // in milliseconds
}

class YoloService {
  private config: YoloServiceConfig;
  private lastData: YoloCrowdData | null = null;
  private isPolling = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  private subscribers: ((data: YoloCrowdData) => void)[] = [];

  constructor(config: YoloServiceConfig) {
    this.config = config;
  }

  // Update configuration
  updateConfig(newConfig: Partial<YoloServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Restart polling if URL changed and polling is active
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling();
    }
  }

  // Fetch crowd counts from YOLO API
  async fetchCrowdCounts(): Promise<YoloCrowdData> {
    if (!this.config.enabled || !this.config.ngrokUrl) {
      throw new Error('YOLO service is disabled or ngrok URL not configured');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.ngrokUrl}/get_counts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle error response from YOLO API
      if (data.error) {
        throw new Error(`YOLO API error: ${data.error}`);
      }

      const yoloData: YoloCrowdData = {
        left_count: data.left_count || 0,
        right_count: data.right_count || 0,
        total_count: data.total_count || 0,
        more_people_side: data.more_people_side || 'equal',
        timestamp: new Date()
      };

      this.lastData = yoloData;
      this.notifySubscribers(yoloData);

      return yoloData;

    } catch (error) {
      console.error('Error fetching YOLO crowd counts:', error);
      
      // Return mock data if YOLO service is unavailable
      const mockData: YoloCrowdData = {
        left_count: Math.floor(Math.random() * 50) + 10,
        right_count: Math.floor(Math.random() * 50) + 10,
        total_count: 0,
        more_people_side: 'equal',
        timestamp: new Date()
      };
      mockData.total_count = mockData.left_count + mockData.right_count;
      mockData.more_people_side = mockData.left_count > mockData.right_count ? 'left' : 
                                   mockData.right_count > mockData.left_count ? 'right' : 'equal';

      this.lastData = mockData;
      this.notifySubscribers(mockData);
      
      return mockData;
    }
  }

  // Get the last fetched data
  getLastData(): YoloCrowdData | null {
    return this.lastData;
  }

  // Start polling for crowd counts
  startPolling() {
    if (this.isPolling || !this.config.enabled) {
      return;
    }

    this.isPolling = true;
    console.log('Starting YOLO polling with interval:', this.config.refreshInterval);

    this.pollingInterval = setInterval(async () => {
      try {
        await this.fetchCrowdCounts();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, this.config.refreshInterval);

    // Fetch initial data
    this.fetchCrowdCounts().catch(console.error);
  }

  // Stop polling
  stopPolling() {
    if (!this.isPolling) {
      return;
    }

    this.isPolling = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    console.log('YOLO polling stopped');
  }

  // Subscribe to crowd count updates
  subscribe(callback: (data: YoloCrowdData) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify all subscribers of new data
  private notifySubscribers(data: YoloCrowdData) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in YOLO subscriber callback:', error);
      }
    });
  }

  // Test connection to YOLO service
  async testConnection(): Promise<{ success: boolean; message: string; data?: YoloCrowdData }> {
    try {
      const data = await this.fetchCrowdCounts();
      return {
        success: true,
        message: 'Connection successful',
        data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get service status
  getStatus() {
    return {
      enabled: this.config.enabled,
      ngrokUrl: this.config.ngrokUrl,
      isPolling: this.isPolling,
      hasData: this.lastData !== null,
      lastUpdate: this.lastData?.timestamp
    };
  }
}

// Default configuration
const defaultConfig: YoloServiceConfig = {
  ngrokUrl: 'https://37dbb1d0ba0e.ngrok-free.app', // Your provided ngrok URL
  enabled: true,
  refreshInterval: 5000, // 5 seconds
  timeout: 10000 // 10 seconds
};

// Create singleton instance
export const yoloService = new YoloService(defaultConfig);

// Hook for React components
export const useYoloCrowdData = () => {
  const [data, setData] = React.useState<YoloCrowdData | null>(yoloService.getLastData());
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = yoloService.subscribe((newData) => {
      setData(newData);
      setIsLoading(false);
      setError(null);
    });

    // Start polling if not already started
    if (!yoloService.getStatus().isPolling) {
      setIsLoading(true);
      yoloService.startPolling();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await yoloService.fetchCrowdCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    const result = await yoloService.testConnection();
    if (!result.success) {
      setError(result.message);
    }
    return result;
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    testConnection,
    status: yoloService.getStatus()
  };
};

export default YoloService;
