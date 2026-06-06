import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
