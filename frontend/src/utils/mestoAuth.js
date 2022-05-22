// export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'https://api.vad.nomoreparties.sbs';
// export const BASE_URL = 'http://localhost:3000';

export const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  }

  return response.json().then((data) => {
    const { statusCode } = data;
    const { message } = data;
    const error = new Error(message || 'Что-то пошло не так');
    error.status = statusCode;
    throw error;
  })
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse)
}


export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse)
};


export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(checkResponse);
}

export const getMyInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${jwt}`,
    },
    credentials: 'include',
  })
    .then(checkResponse)
}