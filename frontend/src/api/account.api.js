import { Get, Post } from './api';

export const getAccount = async () => Get({
  route: '/account',
  shouldAuth: true,
});

export const logoutAccount = async () => Post({
  route: '/logout',
  shouldAuth: true,
  toJson: false,
});
