/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("connexion reuissie")
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion. Vérifiez vos identifiants.');
      toast.error("ehec connexion")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10"
      >
        <Card className="w-[400px] bg-white/95 backdrop-blur-sm shadow-2xl border-blue-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center text-blue-700">
              Sysait - Elearning
            </CardTitle>
            <p className="text-center text-sm text-gray-500">
              Connexion à votre espace enseignant
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-300 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-300 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
