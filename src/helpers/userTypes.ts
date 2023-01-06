export type UserType = 'user' | 'coach' | 'writer' | 'team';

export function getUserType(user?: { metadata?: { userType?: string } }): UserType {
  return (user?.metadata?.userType as UserType) ?? 'user';
}

export function shouldHighlightUserType(type?: UserType) {
  return type && type !== 'user';
}
