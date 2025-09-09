import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DebugPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔍 Debug Information</CardTitle>
            <CardDescription>Current authentication and routing state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📍 Current Route</h3>
                <div className="bg-muted p-3 rounded-lg">
                  <p><strong>Pathname:</strong> {location.pathname}</p>
                  <p><strong>Search:</strong> {location.search || 'None'}</p>
                  <p><strong>Hash:</strong> {location.hash || 'None'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🔐 Authentication</h3>
                <div className="bg-muted p-3 rounded-lg">
                  <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>User Exists:</strong> {user ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>

              {user && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">👤 User Details</h3>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Role:</strong> <span className={`px-2 py-1 rounded text-sm ${user.role === 'authority' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></p>
                      </div>
                      <div>
                        <p><strong>Aadhaar:</strong> {user.aadhaar}</p>
                        <p><strong>Mobile:</strong> {user.mobile}</p>
                        <p><strong>Verified:</strong> {user.isVerified ? '✅ Yes' : '❌ No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">🏠 Expected Routes</h3>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p><strong>Pilgrim Role:</strong></p>
                      <p>Should go to: <code>/pilgrim</code></p>
                    </div>
                    <div>
                      <p><strong>Authority Role:</strong></p>
                      <p>Should go to: <code>/authority</code></p>
                    </div>
                    <div>
                      <p><strong>Current Role:</strong></p>
                      <p>{user ? `Should go to: /` + (user.role === 'authority' ? 'authority' : 'pilgrim') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">🧪 Browser Console Commands</h3>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  <p><code>debugAuth.getAllUsers()</code> - See all available users</p>
                  <p><code>debugAuth.checkUser('123456789014')</code> - Check specific user</p>
                  <p><code>localStorage.getItem('user')</code> - Check stored user</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugPage;
