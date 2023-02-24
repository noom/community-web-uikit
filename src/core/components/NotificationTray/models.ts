export type NotificationRecord = {
  id: string;
  description: string;
  userAccessCode: string;
  imageUrl: string;
  read: boolean;
  path: string;
  actors?: { userAccessCode: string; name: string; avatarUrl: string }[];
  sourceId: string;
  sourceType: string;
  serverTimeUpdated: string;
};
