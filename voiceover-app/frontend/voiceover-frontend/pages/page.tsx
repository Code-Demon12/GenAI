'use client';

import { useEffect, useState, FormEvent } from 'react';

type Voice = {
  name: string;
  gender: string;
  language: string;
};

type Voiceover = {
  title: string;
  text?: string;
  created_at: string;
  audio_url: string;
};

export default function Voiceover() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('Test Voice');
  const [voiceId, setVoiceId] = useState('en-US-JennyNeural');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<Voiceover[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/voices/')
      .then((res) => res.json())
      .then((data) => setVoices(data.voices || []))
      .catch(() => setError('Failed to load voices.'));

    loadHistory(1);
  }, []);

  const loadHistory = (page: number) => {
    fetch(`http://localhost:8000/api/voiceovers/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory((prev) => [...prev, ...data.results]);
        setHasNext(data.has_next);
      })
      .catch(() => setError('Failed to load history.'));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setAudioUrl(null);
    setLoading(true);

    const res = await fetch('http://localhost:8000/api/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text, voice_id: voiceId }),
    });

    const data = await res.json();

    if (res.ok) {
      setAudioUrl(data.audio_url);
      setHistory([data, ...history]);
    } else {
      setError(data.error || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🗣️ Azure Voice Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Voice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Text to convert"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 rounded p-2"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
        >
          <option value="">-- Select Voice --</option>
          {voices.map((v, i) => (
            <option key={i} value={v.name}>
              {v.name} ({v.language}, {v.gender})
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Voiceover'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {audioUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">🔊 Preview</h3>
          <audio controls className="mt-2" src={audioUrl}></audio>
          <a
            className="block mt-2 text-blue-600 underline"
            href={audioUrl}
            download
          >
            ⬇ Download MP3
          </a>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold">📜 Voiceover History</h2>
        {history.map((item, i) => (
          <div
            key={i}
            className="border p-3 my-3 rounded shadow-sm bg-white"
          >
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-600">
              {new Date(item.created_at).toLocaleString()}
            </p>
            {item.text && (
              <p className="mt-1 text-gray-700 italic">{item.text}</p>
            )}
            <audio controls className="mt-2" src={item.audio_url}></audio>
            <a
              href={item.audio_url}
              download
              className="text-blue-600 underline block mt-1"
            >
              ⬇ Download
            </a>
          </div>
        ))}

        {hasNext && (
          <button
            className="mt-4 bg-gray-100 px-4 py-2 rounded border"
            onClick={() => {
              setPage((p) => p + 1);
              loadHistory(page + 1);
            }}
          >
            Load More
          </button>
        )}
      </div>
    </main>
  );
}
