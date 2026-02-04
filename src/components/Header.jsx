import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Analytics', href: '#analytics' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    if(href.startsWith('/')) return; // Allow normal navigation for non-anchor links
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-background/70 backdrop-blur-xl border-border/40 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
                 <span className="text-sm text-foreground/80 font-medium">Hello, {user.fullName.split(' ')[0]}</span>
                 <Button size="sm" variant="ghost" onClick={logout} className="text-muted-foreground hover:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                 </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                  <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-indigo-500 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] transition-all">
                    Get Started
                  </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5">
           <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
             {user ? (
                <Button variant="destructive" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">
                    Sign Out
                </Button>
             ) : (
                <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center">Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                         <Button className="w-full bg-primary text-white shadow-lg shadow-indigo-500/20">Get Started</Button>
                    </Link>
                </>
             )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
