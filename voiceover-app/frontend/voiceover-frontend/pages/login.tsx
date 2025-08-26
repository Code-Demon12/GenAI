'use client'
import { signIn } from 'next-auth/react';
import { useState } from 'react';
// Update the import path below if your Button component is located elsewhere
import { Button } from '@/components/ui/button'; // Update this path as needed to the correct relative location
// Update the path below to the correct location of your Input component, for example:
import { Input } from '@/components/ui/input'; // <-- Adjust if your Input component is in a different location

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
        }}
        className="space-y-4 w-full max-w-sm"
      >
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">Login</Button>
        <Button type="button" className="w-full bg-red-600 hover:bg-red-700" onClick={() => signIn('google')}>Sign in with Google</Button>
      </form>
    </div>
  );
}

