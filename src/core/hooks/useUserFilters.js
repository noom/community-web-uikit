import useUser from '~/core/hooks/useUser';
import { LANGUAGE_METADATA, BUSINESS_TYPE_METADATA, PARTNER_METADATA } from '~/social/constants';

const useUserFilters = (userId) => {
  const { user } = useUser(userId);
  const metadata = user?.metadata ?? {};

  return {
    localeLanguage: metadata[LANGUAGE_METADATA] ?? ['en'],
    businessType: metadata[BUSINESS_TYPE_METADATA] ?? 'B2C',
    partnerId: metadata[PARTNER_METADATA],
  };
};

export default useUserFilters;
