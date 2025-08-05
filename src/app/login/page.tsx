import { AuthForm } from '@/components/auth-form';
import { Phone } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Phone className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">CommunicateEasy</h1>
          <p className="text-muted-foreground">Your conversations, simplified.</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
