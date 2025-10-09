import { h } from 'preact';

const TopBar = () => {
  return (
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div class="flex items-center">
        {/* Placeholder for a logo */}
        <div class="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
        <h1 class="text-xl font-bold">UDAWA Smart System</h1>
      </div>
      <div class="relative">
        {/* Placeholder for user profile icon */}
        <button class="w-10 h-10 bg-gray-600 rounded-full focus:outline-none">
          {/* A simple user icon can be an SVG or a character */}
          <span class="text-white font-bold">U</span>
        </button>
        {/* Dropdown for profile options - to be implemented later */}
      </div>
    </header>
  );
};

export default TopBar;