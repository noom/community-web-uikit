/* eslint-disable react/jsx-no-useless-fragment */

import React, { memo, useMemo } from 'react';
import { CommunitySortingMethod } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import { Box, Link, Icon, Skeleton as UISkeleton } from '@noom/wax-component-library';

import withSDK from '~/core/hocs/withSDK';
import HorizontalList from '~/core/components/HorizontalList';
import CommunityCard from '~/social/components/community/Card';

import useUserFilters from '~/core/hooks/useUserFilters';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';

const COMMUNITY_FETCH_NUM = 20;
const COLUMN_CONFIG = { 1024: 2, 1280: 3, 1440: 3, 1800: 3 };

const Skeleton = ({ size = 4 }) =>
  new Array(size).fill(1).map((x, index) => <CommunityCard key={index} loading />);

const RecommendedList = ({ category, currentUserId, communityLimit = 5 }) => {
  const { localeLanguage, businessType, partnerId } = useUserFilters(currentUserId);
  const { onClickCommunity, onClickCategory } = useNavigation();

  const [communities = [], , , loading] = useCommunitiesList({
    categoryId: category.categoryId,
    sortBy: CommunitySortingMethod.FirstCreated,
    limit: COMMUNITY_FETCH_NUM,
    filter: 'notMember',
  });

  // A user /shouldn't/ be seeing the community list page communities they aren't matching filters on
  // because we should filter out the categories those communities belong to on the Explore page,
  // but this is being done just in case.
  const filteredCommunities = communities.filter(
    (com) =>
      (com.metadata?.['localeLanguage']
        ? localeLanguage === com.metadata?.['localeLanguage']
        : true) &&
      (com.metadata?.['businessType'] ? businessType === com.metadata?.['businessType'] : true) &&
      (com.metadata?.['partnerId'] ? partnerId === com.metadata?.['partnerId'] : true),
  );

  /*
   * To not remove the newly joined communities from the list we cache the first result
   */
  const formattedCommunities = useMemo(() => {
    const notJoinedCommunities = filteredCommunities.filter((c) => !c.isJoined);
    return notJoinedCommunities.slice(0, communityLimit);
  }, [filteredCommunities.length > 0]);

  const title = category.name;

  if (!loading && filteredCommunities.length === 0) {
    return null;
  }

  return (
    <>
      <HorizontalList
        title={title}
        subTitle={category.metadata?.description}
        columns={COLUMN_CONFIG}
      >
        {loading && <Skeleton />}

        {!loading &&
          formattedCommunities.map(({ communityId }) => (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          ))}
      </HorizontalList>

      <Box textAlign="right" mt={2}>
        <Link
          colorScheme="secondary"
          textTransform="uppercase"
          fontWeight="bold"
          display="inline-flex"
          alignItems="center"
          onClick={() => onClickCategory(category.categoryId)}
        >
          <FormattedMessage id="collapsible.viewAll" /> <Icon icon="chevron-right" size="lg" />
        </Link>
      </Box>
    </>
  );
};

export const RecommendedListSkeleton = ({ size = 4 }) => (
  <HorizontalList title={<UISkeleton h="1.5rem" w="20rem" />} columns={COLUMN_CONFIG}>
    <Skeleton size={size} />
  </HorizontalList>
);

export default memo(withSDK(RecommendedList));
