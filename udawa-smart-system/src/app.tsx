import { Router, route } from 'preact-router';
import LoginPage from './pages/LoginPage';
import MainLayout from './pages/MainLayout';
import Dashboard from './pages/Dashboard';

export function App() {
  // A simple check for authentication. In a real app, this would be more complex.
  const isAuthenticated = () => {
    // To test the login flow, you can temporarily set this to `false`.
    // For now, we'll assume the user is logged in to show the main layout.
    // In a real app, you would check for a token in localStorage or a cookie.
    return true;
  };

  // This is a simple client-side guard.
  // If the user is not authenticated and not already on the login page, redirect them.
  if (!isAuthenticated() && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    route('/login', true);
    return null; // Return null to prevent rendering anything while redirecting
  }

  return (
    <Router>
      <LoginPage path="/login" />
      {/*
        All routes nested within MainLayout will share the same sidebar and top bar.
        The `path` prop on MainLayout makes it a layout route.
      */}
      <MainLayout path="/">
        <Router>
          <Dashboard path="dashboard/:deviceModel" />
          {/* A default view when accessing the root of the authenticated area */}
          <Dashboard path="/" deviceModel="gadadar" />
        </Router>
      </MainLayout>
    </Router>
  );
}