"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT_MUTATION } from '../../requests/mutations/auth';
import { useAuth } from '../../hooks/useAuth';
import { UserInfo } from '../ui/UserInfo';

interface CommentItem {
  id: string;
  userId: string;
  text: string;
  createdAt?: string;
}

interface CommentsProps {
  postId: string;
  initialComments: CommentItem[];
}

export function Comments({ postId, initialComments }: CommentsProps) {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(initialComments || []);
  const [visible, setVisible] = useState(5);
  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');

    const temp: CommentItem = {
      id: `tmp-${Date.now()}`,
      userId: 'me',
      text: trimmed,
    };
    setComments((prev) => [temp, ...prev]);

    try {
      const { data } = await createComment({
        variables: { postId, text: trimmed },
      });
      if (data?.createComment) {
        setComments((prev) => [data.createComment, ...prev.filter((c) => c.id !== temp.id)]);
      }
    } catch (e) {
      // откат если ошибка
      setComments((prev) => prev.filter((c) => c.id !== temp.id));
      setText(trimmed);
      console.error('createComment failed', e);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {isAuthenticated && (
        <form onSubmit={submit} className="flex items-start gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишите комментарий..."
            className="flex-1 resize-none rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn btn-primary self-end disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            <span>Отправить</span>
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {comments.slice(0, visible).map((c) => (
          <li key={c.id} className="rounded-lg border border-border/60 bg-card/60 p-3 transition-all duration-200 animate-[fadeIn_.2s_ease-out]">
            <div className="mb-1 text-xs text-muted flex items-center gap-2">
              <UserInfo userId={c.userId} />
              {c.createdAt && <span>· {new Date(c.createdAt).toLocaleString('ru-RU')}</span>}
            </div>
            <div className="text-sm text-card-foreground whitespace-pre-line">{c.text}</div>
            <div className="mt-2 flex items-center gap-2 opacity-70">
              <button className="text-xs px-2 py-1 rounded hover:bg-muted/30 disabled:opacity-50" disabled>
                Редактировать
              </button>
              <button className="text-xs px-2 py-1 rounded hover:bg-muted/30 disabled:opacity-50" disabled>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      {comments.length > visible && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 5)}
            className="btn btn-secondary w-full"
          >
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
}


