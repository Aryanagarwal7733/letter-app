import type { User } from '@firebase/auth-types';

interface LetterEditorProps {
  user: User;
}

function LetterEditor({ user }: LetterEditorProps): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Letter Editor</h1>
      <div className="grid gap-4">
        <textarea 
          className="w-full h-64 p-2 border rounded"
          placeholder="Start writing your letter..."
        />
      </div>
    </div>
  );
}

export default LetterEditor;
