import { useEffect, useState } from 'react';
import { createClient } from '@firebase/firebase-js';
import { User } from '@/types/user';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Note: This is a placeholder - you'll need to configure firebase properly
      // const firebase = createClient(process.env.NEXT_PUBLIC_firebase_URL!, process.env.NEXT_PUBLIC_firebase_ANON_KEY!);
      // const { data, error } = await firebase.auth.getUser();
      // if (error) {
      //   console.error('Error fetching user:', error);
      // } else {
      //   setUser(data.user);
      // }
      
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user profile found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <div className="mt-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> Not configured</p>
        <p><strong>Created At:</strong> Not available</p>
      </div>
    </div>
  );
};

export default ProfilePage;