import { useEffect, useState, useCallback } from 'react';

import { useAsyncData } from '~/social/providers/DataFetchingProvider';
import { PARTNER_METADATA } from '../constants';

export function useNoomUserMetadata(userId: string) {
  const [metadata, setMetadata] = useState({});
  const { getUserMetadata, updateUserMetadata } = useAsyncData();

  const getMetadata = useCallback(
    async (userId: string, callback: (data: Record<string, unknown>) => void) => {
      const response = await getUserMetadata?.(userId);
      callback?.(response?.data ?? {});
    },
    [getUserMetadata],
  );

  const updateMetadata = useCallback(
    async (
      userId: string,
      newMetadata: Record<string, any>,
      callback: (data: Record<string, unknown>) => void,
    ) => {
      newMetadata[PARTNER_METADATA] = parseInt(newMetadata[PARTNER_METADATA]) ?? undefined;
      const response = await updateUserMetadata?.(userId, { ...metadata, ...newMetadata });
      callback?.(response?.data ?? {});
    },
    [updateUserMetadata, metadata],
  );

  useEffect(() => {
    getMetadata(userId, setMetadata);
  }, [userId]);

  return {
    metadata,
    updateMetadata,
  };
}
