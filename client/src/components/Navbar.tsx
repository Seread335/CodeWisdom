import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 bg-white z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center">
              <i className="fas fa-graduation-cap mr-2"></i>
              <span>IT Academy</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className={`${isActive('/') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
            >
              Trang chủ
            </Link>
            <Link 
              href="/courses" 
              className={`${isActive('/courses') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
            >
              Khóa học
            </Link>
            <Link 
              href="/roadmap" 
              className={`${isActive('/roadmap') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
            >
              Lộ trình
            </Link>
            <Link 
              href="/team" 
              className={`${isActive('/team') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
            >
              Đội ngũ
            </Link>
            <Link 
              href="/contact" 
              className={`${isActive('/contact') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
            >
              Liên hệ
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-primary hover:text-primary-dark font-semibold">Đăng nhập</a>
            <a href="#" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Đăng ký</a>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-dark focus:outline-none">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className={`${isActive('/') ? 'text-primary' : 'text-dark'} hover:text-primary py-2 px-2 rounded transition`}
            >
              Trang chủ
            </Link>
            <Link 
              href="/courses" 
              onClick={closeMobileMenu}
              className={`${isActive('/courses') ? 'text-primary' : 'text-dark'} hover:text-primary py-2 px-2 rounded transition`}
            >
              Khóa học
            </Link>
            <Link 
              href="/roadmap" 
              onClick={closeMobileMenu}
              className={`${isActive('/roadmap') ? 'text-primary' : 'text-dark'} hover:text-primary py-2 px-2 rounded transition`}
            >
              Lộ trình
            </Link>
            <Link 
              href="/team" 
              onClick={closeMobileMenu}
              className={`${isActive('/team') ? 'text-primary' : 'text-dark'} hover:text-primary py-2 px-2 rounded transition`}
            >
              Đội ngũ
            </Link>
            <Link 
              href="/contact" 
              onClick={closeMobileMenu}
              className={`${isActive('/contact') ? 'text-primary' : 'text-dark'} hover:text-primary py-2 px-2 rounded transition`}
            >
              Liên hệ
            </Link>
            <div className="flex space-x-4 pt-3 border-t">
              <a href="#" className="text-primary hover:text-primary-dark font-semibold">Đăng nhập</a>
              <a href="#" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Đăng ký</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
