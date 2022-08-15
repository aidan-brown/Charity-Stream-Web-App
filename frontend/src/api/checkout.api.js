import { Get, Post, Put } from './api';

export const getCheckoutStatus = async () => {
  const response = await Get({
    route: '/checkout/status',
    toJson: false,
  });

  return await response.text() === 'true';
};

export const verifyCheckout = async (body) => {
  const response = Post({
    route: '/verify-checkout',
    body,
    shouldAuth: true,
  });

  return response.text();
};

export const verifyDonation = async (body) => Post({
  route: '/verify-donation',
  body,
  shouldAuth: true,
});

export const checkoutDisable = async (status) => Put({
  route: '/disable/checkout',
  body: { status },
  shouldAuth: true,
});
