import { h, ComponentChildren } from 'preact';
import { Router } from 'preact-router';
import Login from './routes/login';

// Inlined, minimal Layout for testing
const DummyLayout = ({ children }: { children: ComponentChildren }) => (
  <div>
    <header><h1>Layout Header</h1></header>
    <main>{children}</main>
  </div>
);

// Inlined, minimal Home for testing
const DummyHome = () => (
  <DummyLayout>
    <h2>Welcome Home</h2>
  </DummyLayout>
);

const App = () => (
  <Router>
    <Login path="/login" />
    <DummyHome path="/" />
  </Router>
);

export default App;