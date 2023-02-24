export const mockNotificationRecordPost = {
  id: '1660634491595',
  description: 'John Doe, Sara Janes and 10 others posted in Summer Collection community',
  userAccessCode: 'TEST1337',
  imageUrl: 'https://ca.slack-edge.com/T025Q42BG-USDP4FL64-6560c2e9cdf1-512',
  read: false,
  path: '',
  actors: [
    {
      name: 'John Doe',
      id: 'TEST1234',
      avatarUrl: 'https://ca.slack-edge.com/T025Q42BG-USDP4FL64-6560c2e9cdf1-512',
    },
    {
      name: 'Sara Janes',
      id: 'TEST1256',
      avatarUrl: '',
    },
  ],
  sourceId: '634678647e482b00d99e9fe3',
  sourceType: 'COMMUNITY',
  serverTimeUpdated: Date.now() - 20 * 1000,
};

export const mockNotificationRecordLike = {
  id: '1660634491595',
  description: 'Sara Janes likes your post in Noomers over 50',
  userAccessCode: 'TEST1337',
  imageUrl: undefined,
  read: false,
  path: '',
  actors: [
    {
      name: 'Sara Janes',
      id: 'TEST1256',
      avatarUrl: '',
    },
  ],
  sourceId: '634678647e482b00d43e9fe3',
  sourceType: 'COMMUNITY',
  serverTimeUpdated: Date.now() - 58 * 1000,
};

export const mockNotificationRecordComment = {
  id: '1660634491595',
  description: 'John Doe commented on your post in Noom bites',
  userAccessCode: 'TEST1337',
  imageUrl: 'https://ca.slack-edge.com/T025Q42BG-USDP4FL64-6560c2e9cdf1-512',
  read: false,
  path: '',
  actors: [
    {
      name: 'John Doe',
      userAccessCode: 'TEST1234',
      avatarUrl: 'https://ca.slack-edge.com/T025Q42BG-USDP4FL64-6560c2e9cdf1-512',
    },
  ],
  sourceId: '634678647e482re0d43e9fe3',
  sourceType: 'COMMUNITY',
  serverTimeUpdated: Date.now() - 300 * 1000,
};
