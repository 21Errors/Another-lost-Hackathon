import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
