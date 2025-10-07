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
    <div className="card">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Редактировать профиль</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-card-foreground mb-2">
            Аватар (URL)
          </label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-card-foreground mb-2">
            О себе
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о себе..."
            rows={4}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary flex-1"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
