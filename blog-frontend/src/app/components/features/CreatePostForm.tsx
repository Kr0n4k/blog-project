'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION } from '../../requests/mutations/auth';
import { useAuth } from '../../hooks/useAuth';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    photos: [] as string[],
    videos: [] as string[],
  });
  const [mediaInput, setMediaInput] = useState('');
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMedia = (type: 'photos' | 'videos') => {
    const trimmed = mediaInput.trim();
    if (!trimmed) return;
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], trimmed]
    }));
    setMediaInput('');
  };

  const removeMedia = (type: 'photos' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    const trimmedTitle = formData.title.trim();
    const trimmedText = formData.text.trim();
    
    if (!trimmedTitle) return;

    try {
      await createPost({
        variables: {
          data: {
            title: trimmedTitle,
            text: trimmedText || undefined,
            photos: formData.photos.length > 0 ? formData.photos : undefined,
            videos: formData.videos.length > 0 ? formData.videos : undefined,
          }
        },
        refetchQueries: ['GetRandomPosts']
      });
      
      setFormData({ title: '', text: '', photos: [], videos: [] });
      onSuccess?.();
    } catch (error) {
      console.error('Create post failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">Войдите, чтобы создавать посты</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-card-foreground mb-4">Создать пост</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
            Заголовок *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="О чем ваш пост?"
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-card-foreground mb-2">
            Текст
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Расскажите подробнее..."
            rows={4}
            className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Медиа (URL)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={mediaInput}
              onChange={(e) => setMediaInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => addMedia('photos')}
              disabled={loading || !mediaInput.trim()}
              className="btn btn-secondary disabled:opacity-60"
            >
              Фото
            </button>
            <button
              type="button"
              onClick={() => addMedia('videos')}
              disabled={loading || !mediaInput.trim()}
              className="btn btn-secondary disabled:opacity-60"
            >
              Видео
            </button>
          </div>

          {formData.photos.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm font-medium text-card-foreground mb-1">Фотографии:</h4>
              <div className="space-y-1">
                {formData.photos.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-muted truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeMedia('photos', index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.videos.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm font-medium text-card-foreground mb-1">Видео:</h4>
              <div className="space-y-1">
                {formData.videos.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-muted truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeMedia('videos', index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Опубликовать'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
