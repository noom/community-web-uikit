import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@noom/wax-component-library';

import useCategories from '~/social/hooks/useCategories';
import RecommendedList, {
  RecommendedListSkeleton,
} from '~/social/components/community/RecommendedList';

import { PageContainer } from './styles';
import withSDK from '~/core/hocs/withSDK';
import useUserFilters from '~/core/hooks/useUserFilters';
import useUser from '~/core/hooks/useUser';

const NUMBER_OF_COMMUNITIES_PER_CATEGORY = 5;

type Category = {
  categoryId: string;
  name: string;
  metadata: {
    description?: string;
  };
};

const List = ({
  categories = [],
  isLoading = false,
}: {
  categories: Category[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <>
        {new Array(3).fill(1).map((_v, index) => (
          <RecommendedListSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {categories?.map((category) => (
        <RecommendedList
          category={category}
          key={category.categoryId}
          communityLimit={NUMBER_OF_COMMUNITIES_PER_CATEGORY}
        />
      ))}
    </>
  );
};

const ExplorePage = ({ currentUserId }) => {
  const { localeLanguage, businessType, partnerId } = useUserFilters(currentUserId);
  const [categories = [], , , loading] = useCategories({
    isDeleted: false,
  }) as [Array<Category>, boolean, () => void, boolean, boolean];

  const user = useUser(currentUserId);
  console.log(user);

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.metadata?.['localeLanguage']
        ? localeLanguage === cat.metadata?.['localeLanguage']
        : true) &&
      (cat.metadata?.['businessType'] ? businessType === cat.metadata?.['businessType'] : true) &&
      (cat.metadata?.['partnerId'] ? partnerId === cat.metadata?.['partnerId'] : true),
  );

  return (
    <PageContainer>
      <Box mb={2}>
        <List categories={filteredCategories} isLoading={loading} />
      </Box>
    </PageContainer>
  );
};

ExplorePage.propTypes = {
  currentUserId: PropTypes.string.isRequired,
};

export default withSDK(ExplorePage);
