import { h } from 'preact';

interface DashboardProps {
  deviceModel?: string;
}

const Dashboard = ({ deviceModel }: DashboardProps) => {
  // A simple map to get a display-friendly name from the model ID
  const deviceNames: { [key: string]: string } = {
    gadadar: 'Gadadar',
    damodar: 'Damodar',
    murari: 'Murari',
  };

  const displayName = deviceModel ? deviceNames[deviceModel] : 'Unknown Device';

  return (
    <div class="p-4 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">Dashboard for {displayName}</h1>
      <p>This is a placeholder for the {displayName} device dashboard.</p>
      <p class="mt-4 text-gray-600">Device Model ID: {deviceModel}</p>
      {/* Chart.js canvas will be added here later */}
    </div>
  );
};

export default Dashboard;