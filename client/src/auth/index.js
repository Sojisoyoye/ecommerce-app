import { API } from '../config';

export const signUp = (user) => {
  return fetch(`${API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const signIn = (user) => {
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const authenticate = (data, cb) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
    cb();
  }
};

export const signOut = (cb) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    cb();
    return fetch(`${API}/signout`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.log(error));
  }
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'));
  } else {
    return false;
  }
};
