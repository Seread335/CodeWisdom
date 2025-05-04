import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, BookOpen, GraduationCap, Layout, 
  Code, Database, Network, Server, 
  Settings, LogOut, Menu, X,
  Info, Map, Laptop, Terminal
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Trang chủ", icon: <Home className="h-5 w-5 mr-3" /> },
    { path: "/about", label: "Giới thiệu", icon: <Info className="h-5 w-5 mr-3" /> },
    { path: "/courses", label: "Khóa học", icon: <BookOpen className="h-5 w-5 mr-3" /> },
    { path: "/roadmap", label: "Lộ trình học", icon: <Map className="h-5 w-5 mr-3" /> },
    { path: "/specialization", label: "Học theo chuyên ngành", icon: <Laptop className="h-5 w-5 mr-3" /> },
    { path: "/code-practice", label: "Thực hành code", icon: <Terminal className="h-5 w-5 mr-3" /> },
    {
      label: "Danh mục",
      icon: <Layout className="h-5 w-5 mr-3" />,
      subItems: [
        { path: "/categories/programming", label: "Lập trình", icon: <Code className="h-4 w-4 mr-3" /> },
        { path: "/categories/database", label: "Cơ sở dữ liệu", icon: <Database className="h-4 w-4 mr-3" /> },
        { path: "/categories/network", label: "Mạng máy tính", icon: <Network className="h-4 w-4 mr-3" /> },
        { path: "/categories/server", label: "Máy chủ", icon: <Server className="h-4 w-4 mr-3" /> },
      ]
    },
  ];

  // For mobile, show a floating button to open the sidebar
  if (isMobile) {
    return (
      <>
        {!isOpen && (
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-4 left-4 z-50 shadow-lg rounded-full h-12 w-12"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="relative flex flex-col w-80 max-w-[80%] h-full bg-sidebar z-50 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-sidebar-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0.745 8.2 2.793 10.5 7 11.23V20h2v-2.5c7-3.59 7-12.64 7-16.5-3-1.2-7-.7-9 0z"></path>
                  </svg>
                  <span className="ml-2 text-xl font-bold text-sidebar-foreground">CodeWisdom</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-sidebar-foreground hover:text-sidebar-accent"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 py-4">
                <nav className="px-2 space-y-1">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      {item.path ? (
                        <Link href={item.path}>
                          <a
                            className={`sidebar-link ${location === item.path ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon}
                            {item.label}
                          </a>
                        </Link>
                      ) : (
                        <div>
                          <div className="sidebar-link">
                            {item.icon}
                            {item.label}
                          </div>
                          <div className="ml-10 mt-1 space-y-1">
                            {item.subItems?.map((subItem, subIndex) => (
                              <Link key={subIndex} href={subItem.path}>
                                <a
                                  className={`sidebar-link text-xs ${location === subItem.path ? 'active' : ''}`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.icon}
                                  {subItem.label}
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
              
              <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium mr-3">
                    {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sidebar-foreground">
                      {user?.displayName || user?.username}
                    </div>
                    <div className="text-xs text-sidebar-foreground/70">
                      {user?.email || "Học viên"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link href="/settings">
                    <a className="sidebar-link" onClick={() => setIsOpen(false)}>
                      <Settings className="h-5 w-5 mr-3" />
                      Cài đặt
                    </a>
                  </Link>
                  <button 
                    className="sidebar-link w-full text-left"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // For desktop, show a permanent sidebar
  return (
    <div className="hidden md:flex md:flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center p-4 border-b border-sidebar-border">
        <svg className="h-8 w-8 text-sidebar-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0.745 8.2 2.793 10.5 7 11.23V20h2v-2.5c7-3.59 7-12.64 7-16.5-3-1.2-7-.7-9 0z"></path>
        </svg>
        <span className="ml-2 text-xl font-bold text-sidebar-foreground">CodeWisdom</span>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.path ? (
                <Link href={item.path}>
                  <a className={`sidebar-link ${location === item.path ? 'active' : ''}`}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ) : (
                <div>
                  <div className="sidebar-link">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className="ml-10 mt-1 space-y-1">
                    {item.subItems?.map((subItem, subIndex) => (
                      <Link key={subIndex} href={subItem.path}>
                        <a className={`sidebar-link text-xs ${location === subItem.path ? 'active' : ''}`}>
                          {subItem.icon}
                          {subItem.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium mr-3">
            {user?.displayName?.charAt(0) || user?.username?.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sidebar-foreground">
              {user?.displayName || user?.username}
            </div>
            <div className="text-xs text-sidebar-foreground/70">
              {user?.email || "Học viên"}
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <Link href="/settings">
            <a className="sidebar-link">
              <Settings className="h-5 w-5 mr-3" />
              Cài đặt
            </a>
          </Link>
          <button 
            className="sidebar-link w-full text-left"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
