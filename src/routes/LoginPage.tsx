import { h } from 'preact';

const LoginPage = () => {
  return (
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div class="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <div class="text-center mb-6">
          {/* Placeholder for a logo */}
          <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <h1 class="text-2xl font-bold text-gray-800">UDAWA Smart System</h1>
          <p class="text-gray-500">Please log in to continue</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div class="mb-4">
            <label for="server" class="block text-sm font-medium text-gray-700 mb-1">Server Address</label>
            <input
              type="text"
              id="server"
              name="server"
              value="prita.undiknas.ac.id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email (Username)</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div class="text-center mt-4">
          <a
            href="https://prita.undiknas.ac.id/login/resetPasswordRequest"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;