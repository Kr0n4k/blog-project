import { useState, useCallback, useRef } from 'react';

interface UsePaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  reset: () => void;
  setTotal: (total: number) => void;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  onLoadMore?: (page: number, limit: number) => Promise<any>;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationState {
  const {
    initialPage = 1,
    initialLimit = 10,
    onLoadMore,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const hasMore = page * limit < total;

  const loadMore = useCallback(async () => {
    if (!onLoadMore || loading || !hasMore || isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      await onLoadMore(page + 1, limit);
      setPage(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки';
      setError(errorMessage);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [onLoadMore, page, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setTotal(0);
    setLoading(false);
    setError(null);
    isLoadingRef.current = false;
  }, [initialPage]);

  return {
    page,
    limit,
    total,
    hasMore,
    loading,
    error,
    loadMore,
    reset,
    setTotal,
  };
}
