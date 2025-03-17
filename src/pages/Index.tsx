
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';
import { getCartItemCount } from '@/lib/data';

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={getCartItemCount()} />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
