import React, { useState, useEffect } from 'react';

import Form from './Form';

function Login(props) {
  const [data, setData] = useState({
    email: '',
    password: '',
    message: ''
  })

  const { email, password, message } = data;

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleLogin(email, password)
  }

  return (
    <section className="login">
      <Form
        onSubmit={handleSubmit}
        caption="Вход"
        buttonText="Войти"
      >
        <input
          value={email}
          name='email'
          type="email"
          onChange={handleChange}
          className="form__input form__input_type_email"
          placeholder="Email"
          required
          autoComplete="email"
        >
        </input>

        <input
          value={password}
          name='password'
          type="password"
          onChange={handleChange}
          className="form__input form__input_type_password"
          placeholder="Пароль"
          required
          autoComplete="current-password"
        >
        </input>

      </Form>

    </section >
  )
}
export default Login;