/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("connexion reuissie")
      router.push('/dashboard');
      
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
          ? (err as any).message
          : 'Échec de la connexion. Vérifiez vos identifiants.'
      );
      toast.error("Échec connexion")
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 relative overflow-hidden">
      {/* Enhanced Background decorative elements with better animations */}
      <div className="absolute inset-0">
        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-400/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-10 right-10 w-32 h-32 border border-blue-300/10 rounded-2xl rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border border-cyan-300/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZC1wYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksIDEzMCwgMjQ2LCAwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQtcGF0dGVybikiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Enhanced card with better animations */}
      <div className="z-10 transform transition-all duration-700 hover:scale-105">
        <Card className="w-[450px] bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden relative">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-cyan-400/10 rounded-3xl"></div>
          
          <CardHeader className="space-y-4 text-center relative z-10 pb-8">
            {/* Logo with enhanced styling */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-blue-900" />
            </div>
            
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
              Sysait - Elearning
            </CardTitle>
            <p className="text-blue-200 text-sm font-medium">
              Connexion à votre espace enseignant
            </p>
          </CardHeader>

          <CardContent className="relative z-10 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-400/30 backdrop-blur-sm">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Email field with modern styling */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-blue-200">
                  Adresse email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 transition-colors group-focus-within:text-blue-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/70 focus:bg-white/15 focus:border-blue-400 rounded-xl transition-all duration-300 hover:bg-white/12"
                  />
                </div>
              </div>

              {/* Password field with show/hide functionality */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-blue-200">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 transition-colors group-focus-within:text-blue-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/70 focus:bg-white/15 focus:border-blue-400 rounded-xl transition-all duration-300 hover:bg-white/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-blue-200 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0" 
                  />
                  Se souvenir de moi
                </label>
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors duration-200 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Enhanced submit button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                disabled={isLoading}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Se connecter
                    </>
                  )}
                </div>
              </Button>
            </form>

            {/* Footer with enhanced styling */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-blue-200">
                Nouveau sur la plateforme ?{' '}
                <a href="#" className="text-blue-300 hover:text-blue-100 font-medium transition-colors duration-200 hover:underline">
                  Contactez l'administration
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}