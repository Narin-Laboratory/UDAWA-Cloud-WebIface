import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import './style.css';

const Login = () => {
  const [server, setServer] = useState('prita.undiknas.ac.id');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://${server}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        route('/', true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div class="login-container">
      <div class="login-box">
        <h1 class="text-2xl font-bold text-center">UDAWA Smart System</h1>
        <form onSubmit={handleLogin} class="mt-4">
          <div>
            <label for="server" class="block text-sm font-medium text-gray-700">Server Address</label>
            <input
              id="server"
              type="text"
              value={server}
              onInput={(e) => setServer(e.currentTarget.value)}
              class="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div class="mt-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="email"
              value={username}
              onInput={(e) => setUsername(e.currentTarget.value)}
              class="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          <div class="mt-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          {error && <p class="mt-2 text-sm text-red-600">{error}</p>}
          <div class="mt-6">
            <button type="submit" class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Login
            </button>
          </div>
          <div class="mt-4 text-center">
            <a href="https://prita.undiknas.ac.id/login/resetPasswordRequest" class="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;