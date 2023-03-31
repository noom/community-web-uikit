import useUser from '~/core/hooks/useUser';

const useUserFilters = (userId) => {
  const { user } = useUser(userId);
  const metadata = user?.metadata ?? {};

  return {
    localeLanguage: metadata['localeLanguage'],
    businessType: metadata['businessType'],
    partnerId: metadata['partnerId'],
  };
};

export default useUserFilters;
