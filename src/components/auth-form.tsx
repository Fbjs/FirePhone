'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { GoogleIcon } from './google-icon';
import { Loader2 } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push('/');
    } catch (error) {
      console.error(error);
      // Handle error display to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await login('demo@example.com', 'password'); // Mock Google sign-in
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Bienvenido de Nuevo' : 'Crear una Cuenta'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Inicia sesión para acceder a tu cuenta.' : 'Ingresa tus datos para comenzar.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-border" />
          <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">O continuar con</span>
          <div className="flex-grow border-t border-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
          <GoogleIcon className="mr-2 h-5 w-5" />
          Iniciar sesión con Google
        </Button>
        <div className="mt-4 text-center text-sm">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="px-1" disabled={isLoading}>
            {isLogin ? 'Regístrate' : 'Iniciar Sesión'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
