import { CommunitySortingMethod } from '@amityco/js-sdk';
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';

import withSDK from '~/core/hocs/withSDK';
import useUserFilters from '~/core/hooks/useUserFilters';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { Grid, ListEmptyState } from './styles';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PaginatedList from '~/core/components/PaginatedList';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import CommunityCard from '~/social/components/community/Card';

const CategoryCommunitiesList = ({ categoryId, currentUserId }) => {
  const { localeLanguage, businessType, partnerId } = useUserFilters(currentUserId);
  const { onClickCommunity } = useNavigation();
  const [communities, hasMore, loadMore, loading, loadingMore] = useCommunitiesList({
    categoryId,
    sortBy: CommunitySortingMethod.DisplayName,
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

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ communityId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return filteredCommunities;
    }

    return [...filteredCommunities, ...getLoadingItems()];
  }, [filteredCommunities, loading, loadingMore]);

  return (
    <InfiniteScroll useWindow loadMore={loadMore} hasMore={hasMore}>
      <PaginatedList
        items={items}
        hasMore={hasMore}
        loadMore={loadMore}
        container={Grid}
        containerProps={{
          columns: { 880: 2, 1280: 3, 1440: 3, 1800: 3 },
        }}
        emptyState={
          <ListEmptyState
            icon={<EmptyFeedIcon width={48} height={48} />}
            title={<FormattedMessage id="CategoryCommunitiesList.emptyTitle" />}
            description={<FormattedMessage id="CategoryCommunitiesList.emptyDescription" />}
          />
        }
      >
        {({ communityId, skeleton }) =>
          skeleton ? (
            <CommunityCard key={communityId} loading />
          ) : (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          )
        }
      </PaginatedList>
    </InfiniteScroll>
  );
};

CategoryCommunitiesList.propTypes = {
  categoryId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default memo(withSDK(CategoryCommunitiesList));
