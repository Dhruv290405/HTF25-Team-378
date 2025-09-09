// Mock Authentication Service for Frontend
// This service simulates the database authentication without requiring Prisma in the browser

export interface MockUser {
  id: string;
  aadhaar: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'pilgrim' | 'authority' | 'admin';
  isVerified: boolean;
  passes?: any[];
  penalties?: any[];
  unreadNotifications?: number;
  bankAccount?: string;
}

// Mock user database that mirrors the seeded data
const mockUsers: MockUser[] = [
  {
    id: '1',
    aadhaar: '123456789012',
    name: 'Ram Kumar',
    mobile: '9876543210',
    email: 'ram.kumar@example.com',
    role: 'pilgrim',
    isVerified: true,
    passes: [],
    penalties: [],
    unreadNotifications: 1,
    bankAccount: 'ACC123456789'
  },
  {
    id: '2',
    aadhaar: '123456789013',
    name: 'Sita Devi',
    mobile: '9876543211',
    email: 'sita.devi@example.com',
    role: 'pilgrim',
    isVerified: true,
    passes: [],
    penalties: [],
    unreadNotifications: 0,
    bankAccount: 'ACC123456790'
  },
  {
    id: '3',
    aadhaar: '123456789014',
    name: 'Admin Officer',
    mobile: '9876543212',
    email: 'admin@mahakumbh.gov.in',
    role: 'authority',
    isVerified: true,
    passes: [],
    penalties: [],
    unreadNotifications: 0
  },
  {
    id: '4',
    aadhaar: '123456789015',
    name: 'Crowd Manager',
    mobile: '9876543213',
    email: 'crowd@mahakumbh.gov.in',
    role: 'authority',
    isVerified: true,
    passes: [],
    penalties: [],
    unreadNotifications: 0
  },
  {
    id: '5',
    aadhaar: '123456789016',
    name: 'Priya Sharma',
    mobile: '9876543214',
    email: 'priya.sharma@example.com',
    role: 'pilgrim',
    isVerified: true,
    passes: [],
    penalties: [],
    unreadNotifications: 0,
    bankAccount: 'ACC123456791'
  }
];

export class MockAuthService {
  // Simulate authentication with a delay
  static async authenticateUser(aadhaar: string): Promise<MockUser | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🔍 MockAuth: Attempting login with Aadhaar:', aadhaar);
    
    const user = mockUsers.find(u => u.aadhaar === aadhaar);
    
    console.log('🔍 MockAuth: Found user:', user ? `${user.name} (${user.role})` : 'null');
    console.log('🔍 MockAuth: User verified:', user?.isVerified);
    
    if (user && user.isVerified) {
      console.log('✅ MockAuth: User authenticated successfully:', user.name, `(${user.role})`);
      const userCopy = { ...user };
      console.log('🔍 MockAuth: Returning user:', userCopy);
      return userCopy; // Return a copy to avoid mutations
    }
    
    console.log('❌ MockAuth: User not found or not verified');
    return null;
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = mockUsers.find(u => u.id === userId);
    return user ? { ...user } : null;
  }

  // Update user verification status
  static async verifyUser(userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isVerified = true;
      return true;
    }
    return false;
  }

  // Get all users (for testing)
  static async getAllUsers(): Promise<MockUser[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers.map(user => ({ ...user }));
  }
}

// Add debug function to window for testing
if (typeof window !== 'undefined') {
  (window as any).debugAuth = {
    getAllUsers: () => mockUsers,
    testAuth: (aadhaar: string) => MockAuthService.authenticateUser(aadhaar),
    checkUser: (aadhaar: string) => mockUsers.find(u => u.aadhaar === aadhaar)
  };
}

export default MockAuthService;
