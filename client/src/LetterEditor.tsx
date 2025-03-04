import { useState } from 'react';
import type { User } from 'firebase/auth';

interface LetterEditorProps {
  user: User;
}

function LetterEditor({ user }: LetterEditorProps): JSX.Element {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!content || !title) {
      setMessage('Please enter both title and content');
      return;
    }

    setSaving(true);
    setMessage('Saving...');

    try {
      const response = await fetch('/api/save-to-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          userId: user.uid,
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const data = await response.json();
      setMessage('Saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Letter Editor</h1>
        <p className="text-gray-600">Signed in as {user.email}</p>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Letter Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter letter title..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Letter Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start writing your letter..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save to Google Drive'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LetterEditor;
