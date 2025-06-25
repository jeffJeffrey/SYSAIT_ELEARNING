'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Calendar, Users, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Leçons', href: '/dashboard/lessons', icon: Calendar },
    { name: 'Élèves', href: '/dashboard/students', icon: Users },
    { name: 'Recommandations', href: '/dashboard/recommendations', icon: Clock },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      className={cn(
        'min-h-screen bg-white border-r flex flex-col shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo et bouton de réduction */}
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && (
          <motion.h1
            className="text-xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Sysait - Elearning
          </motion.h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:bg-gray-100 rounded-full"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <Link href={item.href} key={item.href} className="block">
            <motion.div
              className={cn(
                'flex items-center p-3 rounded-lg',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              whileHover={{
                scale: 1.02,
                backgroundColor: pathname === item.href ? 'rgba(219, 234, 254, 1)' : 'rgba(243, 244, 246, 1)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  pathname === item.href ? 'text-blue-600' : 'text-gray-500'
                )}
              />
              {!isCollapsed && (
                <motion.span
                  className="ml-3 truncate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item.name}
                </motion.span>
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t mt-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            variant="outline"
            className={cn(
              'w-full flex items-center border-gray-200',
              isCollapsed ? 'justify-center' : 'justify-start',
              'hover:bg-gray-100 text-gray-700'
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Déconnexion</span>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}