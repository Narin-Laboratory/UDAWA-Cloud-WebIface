import { h, ComponentChildren } from 'preact';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: ComponentChildren;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div class="flex flex-col h-screen">
      <TopBar />
      <div class="flex flex-1 overflow-hidden">
        <Sidebar />
        <main class="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;