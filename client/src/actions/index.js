export const AUTH_SIGNIN = 'AUTH_SIGNIN';
export const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

export const signIn = (token) => {
  localStorage.setItem('token', token);
  return { type: AUTH_SIGNIN };
};

export const signOut = () => {
  localStorage.removeItem('token');
  return { type: AUTH_SIGNOUT };
};
