import { h, ComponentChild } from 'preact';
import { Router, route, RoutableProps } from 'preact-router';
import { useEffect } from 'preact/hooks';
import Layout from './components/layout';
import Login from './routes/login';
import Home from './routes/home';
import Profile from './routes/profile';
import Gadadar from './routes/dashboard/gadadar';
import Damodar from './routes/dashboard/damodar';
import Murari from './routes/dashboard/murari';

// A component to handle the main application layout and routing logic
const Main = (props: RoutableProps) => {
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    // If there's no token and we're not on the login page, redirect to login
    if (!token) {
      route('/login', true);
    } else {
      // If logged in and at the root, navigate to the home dashboard
      if (props.url === '/') {
        route('/home', true);
      }
    }
  }, [props.url]);

  return (
    <Layout>
      <Router>
        <Home path="/home" />
        <Profile path="/profile" />
        <Gadadar path="/dashboard/gadadar" />
        <Damodar path="/dashboard/damodar" />
        <Murari path="/dashboard/murari" />
      </Router>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <Login path="/login" />
      <Main default />
    </Router>
  );
};

// We need to export 'App' as the default
export default App;