import { LANGUAGE_METADATA, BUSINESS_TYPE_METADATA, PARTNER_METADATA } from '~/social/constants';

const userMatchesCommunityCategorySegment = (
  userLocaleLanguage,
  userBusinessType,
  userPartnerId,
  categoryOrCommunity,
) =>
  (categoryOrCommunity.metadata?.[LANGUAGE_METADATA]
    ? userLocaleLanguage.includes(categoryOrCommunity.metadata?.[LANGUAGE_METADATA])
    : true) &&
  (categoryOrCommunity.metadata?.[BUSINESS_TYPE_METADATA]
    ? userBusinessType === categoryOrCommunity.metadata?.[BUSINESS_TYPE_METADATA]
    : true) &&
  (categoryOrCommunity.metadata?.[PARTNER_METADATA]
    ? userPartnerId === categoryOrCommunity.metadata?.[PARTNER_METADATA]
    : true);
export default userMatchesCommunityCategorySegment;
