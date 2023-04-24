import React from 'react';
import { FormattedMessage } from 'react-intl';
import { HashRouter as Router, Switch, Route, useNavigate, useMatch } from 'react-router-dom';

import useOneUser from '~/mock/useOneUser';
import ProfileSettings from '~/social/components/ProfileSettings';
import UserInfo from '.';

export default {
  title: 'SDK Connected/Social/User/Profile',
  parameters: { layout: 'centered' },
};

const SdkUserInfo = () => {
  const user = useOneUser();

  const navigate = useNavigate();
  const { params = {} } = useMatch('/profile/:userId') || {};
  const { userId } = params;

  const editProfile = (id) => navigate(`/profile/${id}/edit`);

  if (!user) {
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <UserInfo userId={user.userId} currentUserId={user.userId} editProfile={editProfile} />
      </Route>
      <Route path="/profile/:userId/edit">
        <ProfileSettings userId={userId} />
      </Route>
    </Switch>
  );
};

export const SdkUserInfoApp = () => {
  return (
    <Router>
      <SdkUserInfo />
    </Router>
  );
};

SdkUserInfoApp.storyName = 'My User Info';

export const AnotherUserInfo = () => {
  const user = useOneUser();
  if (!user)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <UserInfo userId={user.userId} />;
};

AnotherUserInfo.storyName = 'Another User Info';
