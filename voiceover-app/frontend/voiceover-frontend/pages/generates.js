'use client';
import { useEffect, useState } from 'react';

export default function GeneratePage() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('en-US-JennyNeural');
  const [audioUrl, setAudioUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch previously generated voiceovers
  useEffect(() => {
    fetch('http://localhost:8000/api/voiceovers/')
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!title.trim() || !text.trim()) {
      alert('Please enter title and text.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, voice_id: voiceId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAudioUrl(data.audio_url);
        // Update history
        setHistory([{ ...data, text }, ...history]);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>🎤 Azure TTS Generator</h1>

      <label>Voice ID (default: en-US-JennyNeural)</label>
      <input
        type="text"
        value={voiceId}
        onChange={(e) => setVoiceId(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Voice Title"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to voice"
        rows={4}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Voiceover'}
      </button>

      {audioUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h3>🔊 Preview</h3>
          <audio controls src={audioUrl}></audio>
          <br />
          <a href={audioUrl} download>
            ⬇ Download MP3
          </a>
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h2>📜 History</h2>
      {history.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ccc' }}>
          <p><strong>{item.title}</strong> – {new Date(item.created_at).toLocaleString()}</p>
          <p style={{ fontStyle: 'italic' }}>{item.text}</p>
          <audio controls src={item.audio_url}></audio>
          <br />
          <a href={item.audio_url} download>⬇ Download</a>
        </div>
      ))}
    </div>
  );
}
'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('en-US-JennyNeural');
  const [audioUrl, setAudioUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch('http://localhost:8000/api/voiceovers/')
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [session]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, voice_id: voiceId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAudioUrl(data.audio_url);
        setHistory([{ ...data, text }, ...history]);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return router.push('/login');

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Voice</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border mb-2" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" rows={4} className="w-full p-2 border mb-2" />
      <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white px-4 py-2">
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {audioUrl && <div className="mt-4">
        <audio controls src={audioUrl}></audio>
        <a href={audioUrl} download className="block text-blue-600 underline mt-2">⬇ Download MP3</a>
      </div>}
      <h2 className="text-xl mt-6 font-semibold">📜 History</h2>
      {history.map((item, idx) => (
        <div key={idx} className="mt-2 border p-2">
          <p className="font-semibold">{item.title}</p>
          <audio controls src={item.audio_url}></audio>
        </div>
      ))}
    </div>
  );
}
