import { Get, Post } from './api';

export const getAccount = async () => Get({
  route: '/account',
});

export const logoutAccount = async () => Post({
  route: '/logout',
  toJson: false,
});
