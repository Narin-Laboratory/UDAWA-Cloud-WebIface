import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './style.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Placeholder for fetching user data
    setLoading(false);
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Placeholder for updating user data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div class="profile-container">
      <h1 class="text-2xl font-bold">User Profile</h1>
      <form onSubmit={handleUpdate} class="mt-4">
        <div class="mt-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input id="firstName" type="text" class="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        <div class="mt-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input id="lastName" type="text" class="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        <div class="mt-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" class="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        <div class="mt-6">
          <button type="submit" class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;