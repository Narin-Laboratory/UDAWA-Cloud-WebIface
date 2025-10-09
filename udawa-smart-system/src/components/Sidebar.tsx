import { h } from 'preact';

const Sidebar = () => {
  // Mock device data for now
  const devices = [
    { id: 'gadadar', name: 'Gadadar' },
    { id: 'damodar', name: 'Damodar' },
    { id: 'murari', name: 'Murari' },
  ];

  return (
    <aside class="w-64 bg-gray-100 p-4 shadow-md">
      <h2 class="text-lg font-semibold mb-4">My Devices</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.id} class="mb-2">
            <a href={`/dashboard/${device.id}`} class="block p-2 rounded hover:bg-gray-200">
              {device.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;