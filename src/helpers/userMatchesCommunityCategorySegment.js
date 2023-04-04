import { LANGUAGE_METADATA, BUSINESS_TYPE_METADATA, PARTNER_METADATA } from '~/social/constants';

const userMatchesCommunityCategorySegment = (userFilters, categoryOrCommunity) =>
  (categoryOrCommunity.metadata?.[LANGUAGE_METADATA]
    ? userFilters[LANGUAGE_METADATA].includes(categoryOrCommunity.metadata?.[LANGUAGE_METADATA])
    : true) &&
  (categoryOrCommunity.metadata?.[BUSINESS_TYPE_METADATA]
    ? userFilters[BUSINESS_TYPE_METADATA] === categoryOrCommunity.metadata?.[BUSINESS_TYPE_METADATA]
    : true) &&
  (categoryOrCommunity.metadata?.[PARTNER_METADATA]
    ? userFilters[PARTNER_METADATA] === categoryOrCommunity.metadata?.[PARTNER_METADATA]
    : true);
export default userMatchesCommunityCategorySegment;
