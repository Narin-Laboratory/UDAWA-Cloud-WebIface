import { h, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import './style.css';

type LayoutProps = {
  children: ComponentChildren;
};

const Layout = ({ children }: LayoutProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    route('/login', true);
  };

  return (
    <div class="layout-container">
      <header class="top-bar">
        <div class="branding">UDAWA Smart System</div>
        <div class="user-profile">
          <button onClick={toggleDropdown} class="user-profile-button">
            User Profile
          </button>
          {dropdownOpen && (
            <div class="dropdown-menu">
              <a href="/profile" onClick={() => setDropdownOpen(false)}>Profile</a>
              <button onClick={handleLogout} class="logout-button">Logout</button>
            </div>
          )}
        </div>
      </header>
      <div class="main-content">
        <aside class="sidebar">
          <nav>
            <ul>
              <li><a href="/dashboard/gadadar">Gadadar</a></li>
              <li><a href="/dashboard/damodar">Damodar</a></li>
              <li><a href="/dashboard/murari">Murari</a></li>
            </ul>
          </nav>
        </aside>
        <main class="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;