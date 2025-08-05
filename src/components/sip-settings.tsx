'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SipInfo } from '@/types';
import { Loader2, LogOut, User, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const sipSchema = z.object({
  uri: z.string().min(1, 'La URI es requerida.'),
  server: z.string().min(1, 'El servidor WebSocket es requerido.'),
  password: z.string().optional(),
});

type SipFormData = z.infer<typeof sipSchema>;

interface SipSettingsProps {
  onSave: (sipInfo: SipInfo) => void;
  onDisconnect: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  user: { email: string } | null;
  onLogout: () => void;
}

export function SipSettings({ onSave, onDisconnect, connectionStatus, user, onLogout }: SipSettingsProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const form = useForm<SipFormData>({
    resolver: zodResolver(sipSchema),
    defaultValues: {
      uri: '',
      server: '',
      password: '',
    },
  });

  const onSubmit = (data: SipFormData) => {
    setIsConnecting(true);
    onSave(data);
    // The connection status will be updated via props, so we don't need to set isConnecting to false here.
  };
  
  const handleDisconnect = () => {
      onDisconnect();
      setIsConnecting(false);
  }

  const isConnected = connectionStatus === 'connected';
  const isConnectingOrConnected = connectionStatus === 'connecting' || isConnected;

  return (
    <div className="flex h-full flex-col p-4">
      <div className="text-center mb-8">
        <User className="h-24 w-24 text-muted-foreground mx-auto" />
        <p className="mt-4 text-lg font-medium">{user?.email}</p>
        <p className="text-muted-foreground">Gestiona tu conexión SIP</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajustes SIP</CardTitle>
          <CardDescription>
            {isConnected ? 'Estás conectado.' : 'Ingresa los datos de tu extensión SIP.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="uri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URI SIP</FormLabel>
                    <FormControl>
                      <Input placeholder="sip:usuario@dominio.com" {...field} disabled={isConnectingOrConnected} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servidor WebSocket</FormLabel>
                    <FormControl>
                      <Input placeholder="wss://servidor.com" {...field} disabled={isConnectingOrConnected} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isConnectingOrConnected} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                {isConnected ? (
                  <Button type="button" variant="destructive" onClick={handleDisconnect} className="w-full">
                    <WifiOff /> Desconectar
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={isConnectingOrConnected}>
                    {connectionStatus === 'connecting' && <Loader2 className="animate-spin" />}
                    {connectionStatus !== 'connecting' && <Wifi />}
                    {connectionStatus === 'connecting' ? 'Conectando...' : 'Conectar'}
                  </Button>
                )}
                <div className={cn("text-sm flex items-center gap-2", {
                    "text-green-500": isConnected,
                    "text-yellow-500": connectionStatus === 'connecting',
                    "text-red-500": connectionStatus === 'error',
                    "text-muted-foreground": connectionStatus === 'disconnected',
                })}>
                  {isConnected && <><Wifi className="text-green-500" /><span>Conectado</span></>}
                  {connectionStatus === 'connecting' && <><Loader2 className="animate-spin" /><span>Conectando</span></>}
                  {connectionStatus === 'disconnected' && <><WifiOff /><span>Desconectado</span></>}
                   {connectionStatus === 'error' && <><WifiOff /><span>Error</span></>}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Button variant="link" onClick={onLogout} className="mt-auto mx-auto text-destructive">
        <LogOut /> Cerrar Sesión
      </Button>
    </div>
  );
}
