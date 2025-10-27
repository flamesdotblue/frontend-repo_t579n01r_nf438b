import { useState, useEffect } from 'react';

const defaultAvatars = [
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Alex',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Bailey',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Casey',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Drew',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Elliot',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Frankie',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Georgie',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Harper',
];

export default function AvatarGrid({ value, onChange, avatars = defaultAvatars }) {
  const [selected, setSelected] = useState(value || avatars[0]);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleSelect = (url) => {
    setSelected(url);
    onChange?.(url);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((url) => (
          <button
            type="button"
            key={url}
            onClick={() => handleSelect(url)}
            className={`rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selected === url ? 'ring-2 ring-indigo-500 border-indigo-500' : 'hover:shadow'
            }`}
          >
            <img src={url} alt="avatar" className="w-full aspect-square rounded-xl" />
          </button>
        ))}
      </div>
      <div className="mt-3 text-sm text-slate-600">
        Selected avatar will appear on your profile.
      </div>
    </div>
  );
}
