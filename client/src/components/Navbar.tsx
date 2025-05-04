import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading, logout } = useAuth();

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
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className={`${isActive('/profile') ? 'text-primary' : 'text-dark'} hover:text-primary flex items-center space-x-2 font-medium transition`}
                >
                  <FaUserCircle className="text-xl" />
                  <span>{user.displayName || user.username}</span>
                </Link>
                {user.role === "admin" && (
                  <Link 
                    href="/admin" 
                    className={`${isActive('/admin') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
                  >
                    Quản trị
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-600 font-medium transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-primary hover:text-primary-dark font-semibold">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Đăng ký
                </Link>
              </>
            )}
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
            <div className="flex flex-col space-y-3 pt-3 border-t">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <Link 
                    href="/profile" 
                    onClick={closeMobileMenu}
                    className={`${isActive('/profile') ? 'text-primary' : 'text-dark'} hover:text-primary flex items-center space-x-2 font-medium transition`}
                  >
                    <FaUserCircle className="text-xl" />
                    <span>{user.displayName || user.username}</span>
                  </Link>
                  {user.role === "admin" && (
                    <Link 
                      href="/admin" 
                      onClick={closeMobileMenu}
                      className={`${isActive('/admin') ? 'text-primary' : 'text-dark'} hover:text-primary font-medium transition`}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }} 
                    className="text-red-500 hover:text-red-600 font-medium transition text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link 
                    href="/login" 
                    onClick={closeMobileMenu}
                    className="text-primary hover:text-primary-dark font-semibold"
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={closeMobileMenu}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
