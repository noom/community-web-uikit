import { useEffect, useState, useCallback } from 'react';

import { useAsyncData } from '~/social/providers/DataFetchingProvider';

export function useNoomCategoryMetadata(categoryId: string) {
  const [metadata, setMetadata] = useState({});
  const { getCategoryMetadata, updateCategoryMetadata } = useAsyncData();

  const getMetadata = useCallback(
    async (categoryId: string, callback: (data: Record<string, unknown>) => void) => {
      const response = await getCategoryMetadata?.(categoryId);
      callback?.(response?.data ?? {});
    },
    [getCategoryMetadata],
  );

  const updateMetadata = useCallback(
    async (
      categoryId: string,
      newMetadata: Record<string, any>,
      callback: (data: Record<string, unknown>) => void,
    ) => {
      const response = await updateCategoryMetadata?.(categoryId, { ...metadata, ...newMetadata });
      callback?.(response?.data ?? {});
    },
    [updateCategoryMetadata, metadata],
  );

  useEffect(() => {
    getMetadata(categoryId, setMetadata);
  }, [categoryId]);

  return {
    metadata,
    updateMetadata,
  };
}
