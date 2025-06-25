'use client';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Bell } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import SideBar from '@/components/SideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [notifications] = useState([
    { id: 1, message: 'Nouvelle recommandation de planning disponible', read: false },
    { id: 2, message: 'Leçon de mathématiques à 10h confirmée', read: true },
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-500/80 text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!user && !loading) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">
            Bonjour, <span className="text-blue-600 font-semibold">{user?.first_name}</span>
          </h2>
          
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <Bell className="h-[1.2rem] w-[1.2rem]" />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2 bg-white shadow-xl rounded-xl border border-gray-200">
                <h3 className="px-2 py-1.5 text-sm font-medium text-gray-500">Notifications</h3>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`${
                      notification.read ? 'text-gray-600' : 'text-gray-900 bg-blue-50 font-medium'
                    } px-3 py-2 rounded-lg mb-1 last:mb-0`}
                  >
                    {notification.message}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="text-gray-700 hover:bg-gray-50 border-gray-300 rounded-full px-3"
              asChild
            >
              <a href="/profile" className="flex items-center">
                <User className="h-[1.2rem] w-[1.2rem] mr-2 text-blue-600" />
                <span>Profil</span>
              </a>
            </Button>
          </div>
        </header>

        <motion.main
          className="flex-1 p-6 bg-gray-50 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}