
// pages/index.tsx
'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <h1 className="text-5xl font-bold mb-4 text-gray-900">🎙️ AI Voiceover Generator</h1>
      <p className="text-gray-600 max-w-xl text-lg">
        Generate studio-quality speech from text using cutting-edge AI like Azure and ElevenLabs.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Login
        </Link>
        <Link href="/register" className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition">
          Register
        </Link>
        <Link href="/generate" className="px-6 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition">
          Try it Free
        </Link>
        <Link href="/pricing" className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition">
          See Pricing
        </Link>
        <Link href="/page" className="px-6 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition">
        Voiceover
        </Link>
      </div>

      <section className="mt-10 max-w-4xl text-left">
        <h2 className="text-2xl font-semibold mb-2">🚀 Features</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Real-time voice generation using Azure and ElevenLabs</li>
          <li>Choose from dozens of voice presets</li>
          <li>History of your voiceovers with playback and download</li>
          <li>Secure login with email or Google</li>
          <li>Subscription plans with Stripe integration</li>
        </ul>
      </section>

      <footer className="mt-16 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Voiceover App · <Link href="/about" className="underline">About</Link>
      </footer>
    </main>
  );
}

