// src/utils/cartUtils.js

export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cartItems) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};
