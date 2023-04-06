import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CommunityFilter, CommunitySortingMethod } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';
import CommunityHeader from '~/social/components/community/Header';
import UserHeader from '~/social/components/UserHeader';
import customizableComponent from '~/core/hocs/customization';
import useUserFilters from '~/core/hooks/useUserFilters';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  SocialSearchContainer,
  SocialSearchInput,
  SearchIcon,
  SearchIconContainer,
} from './styles';
import useUserQuery from '~/core/hooks/useUserQuery';
import userMatchesCommunityCategorySegment from '~/helpers/userMatchesCommunityCategorySegment';

const communityRenderer = (communities) => (communityName) => {
  const { communityId } = communities.find((item) => item.displayName === communityName) ?? {};

  return !!communityId && <CommunityHeader communityId={communityId} />;
};

const userRenderer = (users) => (userName) => {
  const { userId, isGlobalBan } = users.find((item) => item.displayName === userName) ?? {};

  return !!userId && <UserHeader userId={userId} isBanned={isGlobalBan} />;
};

const SocialSearch = ({ className, sticky = false, searchBy, currentUserId }) => {
  const userFilters = useUserFilters(currentUserId);
  const { onClickCommunity, onClickUser } = useNavigation();
  const [value, setValue] = useState('');
  const [users = [], hasMoreUsers, loadMoreUsers] = useUserQuery(value);
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList({
    search: value,
    filter: CommunityFilter.All,
    sortBy: CommunitySortingMethod.DisplayName,
  });
  const handleChange = (newVal) => {
    setValue(newVal);
  };

  const filteredUsers = users.filter((user) => {
    const otherLocaleLanguage = user.metadata?.localeLanguage ?? ['en'];
    const otherBusinessType = user.metadata?.businessType ?? 'B2C';
    return (
      userFilters.localeLanguage.some((lang) => otherLocaleLanguage?.includes(lang)) &&
      userFilters.businessType === otherBusinessType
    );
  });
  const filteredCommunities = communities.filter((com) =>
    userMatchesCommunityCategorySegment(userFilters, com),
  );

  const getPagination = (activeTab) => {
    const hasMore = activeTab === 'communities' ? hasMoreCommunities : hasMoreUsers;
    const loadMore = activeTab === 'communities' ? loadMoreCommunities : loadMoreUsers;

    return hasMore ? loadMore : undefined;
  };

  const handlePick = (name, activeTab) => {
    if (activeTab === 'communities') {
      const { communityId } = filteredCommunities.find((item) => item.displayName === name) ?? {};
      communityId && onClickCommunity(communityId);
    } else if (activeTab === 'accounts') {
      const { userId } = filteredUsers.find((item) => item.displayName === name) ?? {};
      userId && onClickUser(userId);
    }
  };

  const rendererMap = useMemo(
    () => ({
      communities: communityRenderer(filteredCommunities),
      accounts: userRenderer(filteredUsers),
    }),
    [filteredCommunities, filteredUsers],
  );

  const allItems = useMemo(
    () => ({
      communities: filteredCommunities.map((community) => community.displayName),
      accounts: filteredUsers.map((user) => user.displayName),
    }),
    [filteredCommunities, filteredUsers],
  );

  const items = useMemo(() => {
    return Object.keys(allItems).reduce((acc, key) => {
      if (searchBy.includes(key)) {
        acc[key] = allItems[key];
      }

      return acc;
    }, {});
  }, [allItems, searchBy]);

  return (
    <SocialSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <SocialSearchInput
            data-qa-anchor="social-search-input"
            value={value}
            setValue={setValue}
            items={items}
            filter={null}
            className={className}
            getPagination={getPagination}
            placeholder={placeholder}
            prepend={
              <SearchIconContainer>
                <SearchIcon />
              </SearchIconContainer>
            }
            onChange={handleChange}
            onPick={handlePick}
          >
            {(displayName, inputValue, activeTab) => rendererMap[activeTab](displayName)}
          </SocialSearchInput>
        )}
      </FormattedMessage>
    </SocialSearchContainer>
  );
};

SocialSearch.propTypes = {
  className: PropTypes.string,
  sticky: PropTypes.bool,
  searchBy: PropTypes.arrayOf(PropTypes.string),
  currentUserId: PropTypes.string.isRequired,
};

SocialSearch.defaultProps = {
  sticky: false,
  searchBy: ['communities', 'accounts'],
};

export default withSDK(customizableComponent('SocialSearch', SocialSearch));
