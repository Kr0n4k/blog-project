'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE_MUTATION } from '../../requests/mutations/auth';
import { useAuth } from '../../hooks/useAuth';

interface ProfileEditFormProps {
  initialBio?: string;
  initialAvatar?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProfileEditForm({ initialBio = '', initialAvatar = '', onSuccess, onCancel }: ProfileEditFormProps) {
  const { user } = useAuth();
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile({
        variables: { bio: bio.trim() || null, avatar: avatar.trim() || null },
        optimisticResponse: {
          updateProfile: {
            __typename: 'UserModel',
            id: user.id,
            bio: bio.trim() || null,
            avatar: avatar.trim() || null,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
          }
        }
      });
      onSuccess?.();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="card-hi-tech rounded-lg p-6 border border-green-400">
      <div className="flex items-center mb-6">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-hi-tech-pulse"></div>
        <h3 className="text-lg font-bold text-green-400 font-mono tracking-wider">EDIT PROFILE</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-green-400 mb-3 font-mono tracking-wider">
            AVATAR URL
          </label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-blue-400 mb-3 font-mono tracking-wider">
            BIO
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="TELL US ABOUT YOURSELF..."
            rows={4}
            className="w-full input-hi-tech rounded-lg p-4 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-hi-tech flex-1 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-hi-tech flex-1 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-mono"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
