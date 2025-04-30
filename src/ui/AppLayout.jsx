import { Outlet } from 'react-router-dom';
import Header from './Header';

function AppLayout() {
  // This component serves as a layout for the application
  return (
    <div>
      <Header />
      <main className="bg-theme-extralight mt-17 h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
