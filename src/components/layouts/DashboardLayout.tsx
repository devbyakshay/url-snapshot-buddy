
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart3,
  Home,
  Link,
  LogOut,
  Menu,
  QrCode,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" />
    },
    { 
      name: 'URL Shortener', 
      path: '/urls', 
      icon: <Link className="h-5 w-5" />
    },
    { 
      name: 'QR Codes', 
      path: '/qrcodes', 
      icon: <QrCode className="h-5 w-5" />
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <BarChart3 className="h-5 w-5" />
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" />
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "h-full w-64 border-r border-border transition-all duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "fixed md:relative z-40 glass-morphism"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border/40">
            <h1 className="text-xl font-bold text-gradient">SnapURL</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg transition-all",
                  "hover:bg-white/10 group",
                  location.pathname === item.path 
                    ? "bg-white/10 text-white" 
                    : "text-gray-400"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border/40">
            <div className="flex items-center mb-4 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                <span className="text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300",
        isSidebarOpen ? "md:ml-0" : "md:ml-0"
      )}>
        <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-morphism">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user?.plan_type === 'premium' ? 'Premium Plan' : 'Free Plan'}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
