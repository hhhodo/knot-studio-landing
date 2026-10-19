import KnotNavbar from './components/KnotNavbar';
import KnotHero from './components/KnotHero';
import KnotServices from './components/KnotServices';
import KnotAboutSection from './components/KnotAboutSection';
import KnotFeaturedProducts from './components/KnotFeaturedProducts';
import KnotTestimonials from './components/KnotTestimonials';
import KnotCTA from './components/KnotCTA';
import KnotFooter from './components/KnotFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <KnotNavbar />
      <KnotHero />
      <KnotServices />
      <KnotAboutSection />
      <KnotFeaturedProducts />
      <KnotTestimonials />
      <KnotCTA />
      <KnotFooter />
    </div>
  );
}
