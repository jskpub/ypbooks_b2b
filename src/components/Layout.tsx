import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header/Header';
import SkipNav from '@/components/SkipNav';

export default function Layout() {
  return (
    <>
      <SkipNav />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
