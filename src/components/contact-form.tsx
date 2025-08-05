'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Contact } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, User } from 'lucide-react';

const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido.'),
  number: z.string().min(1, 'El número es requerido.'),
  avatarUrl: z.string().url('URL de avatar no válida').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact?: Contact | null;
}

export function ContactForm({ isOpen, onClose, onSave, contact }: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      id: '',
      name: '',
      number: '',
      avatarUrl: '',
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contact) {
      form.reset(contact);
    } else {
      form.reset({
        id: `contact-${Date.now()}`,
        name: '',
        number: '',
        avatarUrl: '',
      });
    }
  }, [contact, form, isOpen]);

  const onSubmit = (data: ContactFormData) => {
    const finalData: Contact = {
        id: data.id || `contact-${Date.now()}`,
        name: data.name,
        number: data.number,
        avatarUrl: data.avatarUrl || undefined,
    }
    onSave(finalData);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('avatarUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarUrl = form.watch('avatarUrl');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contacto' : 'Crear Contacto'}</DialogTitle>
          <DialogDescription>
            {contact
              ? 'Actualiza la información de tu contacto.'
              : 'Añade un nuevo contacto a tu agenda.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt="Avatar de contacto" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="h-5 w-5" />
                </Button>
                <FormControl>
                    <Input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                </FormControl>
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="555-0101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>URL del Avatar (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
