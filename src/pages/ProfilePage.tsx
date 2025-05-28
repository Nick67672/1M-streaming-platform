import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Edit, Mail, Calendar, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleSaveProfile = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const { error } = await updateProfile({
        username,
      });
      
      if (error) {
        throw error;
      }
      
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03A9F4]"></div>
        </div>
      </Layout>
    );
  }
  
  if (!user || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Not logged in</h2>
            <p className="text-gray-400 mb-4">
              Please log in to view your profile.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#03A9F4] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#03A9F4] to-[#00BCD4] h-32"></div>
            
            <div className="relative px-6 pb-6">
              {/* Profile Avatar */}
              <div className="absolute -top-12 left-6">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.username} 
                    className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#03A9F4] flex items-center justify-center border-4 border-gray-900">
                    <User size={40} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end mt-4">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center bg-[#03A9F4] hover:bg-[#29B6F6] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Profile
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <LogOut size={18} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="mt-12">
                {error && (
                  <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03A9F4] focus:border-transparent w-full max-w-md"
                          placeholder="Username"
                        />
                      ) : (
                        profile.username
                      )}
                    </h1>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Mail size={20} className="text-[#03A9F4] mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Calendar size={20} className="text-[#03A9F4] mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Member Since</p>
                          <p className="text-white">{formatDate(profile.joinDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Section */}
          <div className="mt-8 bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">
                Your watch history and activity will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;