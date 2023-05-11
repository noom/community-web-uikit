export const MAXIMUM_MENTIONEES = 30;

export const LANGUAGE_METADATA = 'localeLanguage';
export const BUSINESS_TYPE_METADATA = 'businessType';
export const PARTNER_METADATA = 'partnerId';

export const ANONYMOUS_METADATA = 'isAnonymous';

export const PageTypes = {
  Explore: 'explore',
  Category: 'category',
  NewsFeed: 'newsFeed',
  CommunityFeed: 'communityFeed',
  CommunityEdit: 'communityEdit',
  CommunityPost: 'communityPost',
  CommunityComment: 'communityComment',
  UserFeed: 'userFeed',
  UserEdit: 'userEdit',
  UserPost: 'userPost',
  UserComment: 'userComment',
};

export const MemberRoles = Object.freeze({
  MEMBER: 'member',
  COMMUNITY_MODERATOR: 'community-moderator',
  CHANNEL_MODERATOR: 'channel-moderator',
});

export const VideoFileStatus = Object.freeze({
  Uploaded: 'uploaded',
  Transcoding: 'transcoding',
  Transcoded: 'transcoded',
  TranscodeFailed: 'transcodeFailed',
});

export const VideoQuality = Object.freeze({
  FHD: '1080p',
  HD: '720p',
  SD: '480p',
  LD: '360p',
  Original: 'original',
});

export const MP4MimeType = 'video/mp4';
