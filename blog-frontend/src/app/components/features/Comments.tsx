"use client";

import { useState, useEffect } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { CREATE_COMMENT_MUTATION, UPDATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION } from '../../requests/mutations/auth';
import { COMMENT_ADDED_SUBSCRIPTION, COMMENT_UPDATED_SUBSCRIPTION, COMMENT_DELETED_SUBSCRIPTION } from '../../requests/subscriptions/subscriptions';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import { useAuth } from '../../hooks/useAuth';
import { UserInfo } from '../ui/UserInfo';

interface CommentItem {
  id: string;
  userId: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CommentsProps {
  postId: string;
  initialComments: CommentItem[];
}

export function Comments({ postId, initialComments }: CommentsProps) {
  const { isAuthenticated, user } = useAuth();
  const { addCommentToCache, updateCommentInCache, removeCommentFromCache } = useRealtimeUpdates();
  const [text, setText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(initialComments || []);
  const [visible, setVisible] = useState(5);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateComment, { loading: updateLoading }] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteComment, { loading: deleteLoading }] = useMutation(DELETE_COMMENT_MUTATION);

  // Подписка на новые комментарии
  const { data: commentData } = useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
    variables: { postId },
    skip: !postId
  });

  // Подписка на обновления комментариев
  const { data: commentUpdatedData } = useSubscription(COMMENT_UPDATED_SUBSCRIPTION, {
    variables: { postId },
    skip: !postId
  });

  // Подписка на удаление комментариев
  const { data: commentDeletedData } = useSubscription(COMMENT_DELETED_SUBSCRIPTION, {
    variables: { postId },
    skip: !postId
  });

  // Обновляем список комментариев при получении нового комментария
  useEffect(() => {
    if (commentData?.commentAdded) {
      const newComment = commentData.commentAdded;
      // Проверяем, не дублируется ли комментарий
      const commentExists = comments.some(comment => comment.id === newComment.id);
      if (!commentExists) {
        setComments(prev => [newComment, ...prev]);
        // Обновляем кэш
        addCommentToCache(postId, newComment);
      }
    }
  }, [commentData, comments, postId, addCommentToCache]);

  // Обновляем комментарий при получении обновления
  useEffect(() => {
    if (commentUpdatedData?.commentUpdated) {
      const updatedComment = commentUpdatedData.commentUpdated;
      setComments(prev => prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      ));
      // Обновляем кэш
      updateCommentInCache(postId, updatedComment);
    }
  }, [commentUpdatedData, postId, updateCommentInCache]);

  // Удаляем комментарий при получении события удаления
  useEffect(() => {
    if (commentDeletedData?.commentDeleted) {
      const deletedComment = commentDeletedData.commentDeleted;
      setComments(prev => prev.filter(comment => comment.id !== deletedComment.id));
      // Обновляем кэш
      removeCommentFromCache(postId, deletedComment.id);
    }
  }, [commentDeletedData, postId, removeCommentFromCache]);

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

  // Функция для начала редактирования комментария
  const handleEditStart = (comment: CommentItem) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  // Функция для отмены редактирования
  const handleEditCancel = () => {
    setEditingComment(null);
    setEditText('');
  };

  // Функция для сохранения изменений комментария
  const handleEditSave = async (commentId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      alert('⚠️ Comment cannot be empty. Please enter some text.');
      return;
    }
    
    if (trimmed.length > 1000) {
      alert('⚠️ Comment is too long. Please keep it under 1000 characters.');
      return;
    }

    // Оптимистичное обновление - обновляем комментарий в UI сразу
    const updatedComment = {
      id: commentId,
      text: trimmed,
      userId: comments.find(c => c.id === commentId)?.userId || '',
      createdAt: comments.find(c => c.id === commentId)?.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? updatedComment : comment
    ));
    updateCommentInCache(postId, updatedComment);
    setEditingComment(null);
    setEditText('');

    try {
      const result = await updateComment({
        variables: { commentId, text: trimmed }
      });
      console.log('Comment updated successfully:', result);
    } catch (error) {
      console.error('Error updating comment:', error);
      // В случае ошибки возвращаем оригинальный комментарий
      const originalComment = comments.find(c => c.id === commentId);
      if (originalComment) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? originalComment : comment
        ));
        updateCommentInCache(postId, originalComment);
      }
      // Показываем пользователю ошибку
      alert('❌ Failed to update comment. Please check your connection and try again.');
    }
  };

  // Функция для удаления комментария
  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    // Проверяем авторизацию
    if (!isAuthenticated || !user) {
      alert('❌ You must be logged in to delete comments. Please log in first.');
      return;
    }

    console.log('Attempting to delete comment:', commentId);
    console.log('User authenticated:', isAuthenticated);
    console.log('User:', user);

    // Сохраняем оригинальный комментарий для возможного отката
    const originalComment = comments.find(c => c.id === commentId);
    if (!originalComment) return;

    // Оптимистичное обновление - удаляем комментарий из UI сразу
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    removeCommentFromCache(postId, commentId);

    try {
      const result = await deleteComment({
        variables: { commentId }
      });
      console.log('Comment deleted successfully:', result);
    } catch (error) {
      console.error('Error deleting comment:', error);
      console.error('Error details:', error.message);
      console.error('Error network:', error.networkError);
      
      // В случае ошибки возвращаем комментарий обратно
      setComments(prev => [originalComment, ...prev]);
      addCommentToCache(postId, originalComment);
      
      // Показываем пользователю более детальную ошибку
      if (error.message?.includes('You are not authorized')) {
        alert('❌ You are not authorized to delete this comment. Please log in again.');
      } else {
        alert('❌ Failed to delete comment. Please check your connection and try again.');
      }
    }
  };

  // Проверяем, может ли пользователь редактировать/удалять комментарий
  const canEditComment = (comment: CommentItem) => {
    return user && comment.userId === user.id;
  };

  return (
    <div className="mt-4 space-y-3">
      {isAuthenticated && (
        <form onSubmit={submit} className="flex items-start gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="WRITE A COMMENT..."
            className="flex-1 resize-none input-hi-tech rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-hi-tech self-end disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 font-mono"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            <span>SEND</span>
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {comments.slice(0, visible).map((c) => (
          <li key={c.id} className="group card-hi-tech rounded-lg border border-gray-600 p-3 transition-all duration-200 animate-[fadeIn_.2s_ease-out] hover:border-green-400/50 hover:hi-tech-glow">
            <div className="mb-1 text-xs text-white/60 flex items-center gap-2 font-mono">
              <UserInfo userId={c.userId} />
              {c.createdAt && <span>· {new Date(c.createdAt).toLocaleString('en-US').toUpperCase()}</span>}
              {c.updatedAt && c.updatedAt !== c.createdAt && (
                <span className="text-green-400">· EDITED</span>
              )}
            </div>
            
            {editingComment === c.id ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-hi-tech-pulse"></div>
                  <span className="text-green-400 text-xs font-mono tracking-wider">EDITING MODE</span>
                </div>
                <div className="relative">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full input-hi-tech rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    rows={3}
                    placeholder="EDIT YOUR COMMENT..."
                    autoFocus
                    maxLength={1000}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-white/40 font-mono">
                    {editText.length}/1000
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEditSave(c.id)}
                    disabled={updateLoading || !editText.trim()}
                    className="btn-hi-tech px-4 py-2 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updateLoading && (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                    {updateLoading ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 text-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-black rounded-lg font-mono transition-all duration-200"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm text-white whitespace-pre-line font-mono leading-relaxed">{c.text}</div>
                {canEditComment(c) && (
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={() => handleEditStart(c)}
                      className="text-xs px-3 py-1.5 rounded-lg hover:bg-green-400/10 border border-gray-600 hover:border-green-400 text-green-400 hover:text-green-300 font-mono transition-all duration-200 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      disabled={deleteLoading}
                      className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/10 border border-gray-600 hover:border-red-400 text-red-400 hover:text-red-300 font-mono transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {deleteLoading ? (
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      {deleteLoading ? 'DELETING...' : 'DELETE'}
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {comments.length > visible && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 5)}
            className="btn-hi-tech w-full font-mono"
          >
            SHOW MORE
          </button>
        </div>
      )}
    </div>
  );
}


