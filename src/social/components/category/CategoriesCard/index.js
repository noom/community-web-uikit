import React, { useMemo } from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';
import useUserFilters from '~/core/hooks/useUserFilters';
import useCategories from '~/social/hooks/useCategories';
import { useNavigation } from '~/social/providers/NavigationProvider';
import HorizontalList from '~/core/components/HorizontalList';
import CommunityCategoryCard from '~/social/components/community/CategoryCard';
import userMatchesCommunityCategorySegment from '~/helpers/userMatchesCommunityCategorySegment';

const StyledCommunityCategoryCard = styled(CommunityCategoryCard)`
  &:first-child {
    padding-right: 1rem;
    padding-left: 0;
  }

  &:last-child {
    padding-left: 1rem;
    padding-right: 0;
  }

  padding-left: 1rem;
  padding-right: 1rem;
`;

const List = ({ currentUserId }) => {
  const { onClickCategory } = useNavigation();
  const [categories, hasMore, loadMore, loading, loadingMore] = useCategories({ isDeleted: false });
  const userFilters = useUserFilters(currentUserId);

  const filteredCategories = categories.filter((cat) =>
    userMatchesCommunityCategorySegment(userFilters, cat),
  );

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(6).fill(1).map((x, index) => ({ categoryId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return filteredCategories;
    }

    return [...filteredCategories, ...getLoadingItems()];
  }, [filteredCategories, loading, loadingMore]);

  return (
    <HorizontalList
      columns={{
        1024: 3,
        1280: 5,
        1440: 5,
        1800: 5,
      }}
      title={<FormattedMessage id="categoryList" />}
      hasMore={hasMore}
      loadMore={loadMore}
    >
      {items.map(({ categoryId, skeleton }) =>
        skeleton ? (
          <StyledCommunityCategoryCard key={categoryId} loading />
        ) : (
          <StyledCommunityCategoryCard
            key={categoryId}
            categoryId={categoryId}
            onClick={onClickCategory}
          />
        ),
      )}
    </HorizontalList>
  );
};

export default withSDK(List);
