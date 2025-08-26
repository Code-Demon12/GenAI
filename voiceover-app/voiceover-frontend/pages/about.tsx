'use client';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-gray-700">This app uses Azure TTS and ElevenLabs API to generate realistic human-like voiceovers from text. Built with Django + Next.js for fast performance and secure backend.</p>
    </div>
  );
}