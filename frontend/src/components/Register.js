import { useState } from 'react';
import Form from './Form';
import React, { Link } from 'react-router-dom';


function Register(props) {

  const [data, setData] = useState({
    email: '',
    password: '',
    message: ''
  });

  const { email, password } = data;

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleRegister(email, password)
  }

  return (
    <section className="register">
      <Form
        onSubmit={handleSubmit}
        caption="Регистрация"
        buttonText="Зарегистрироваться"
      >
        <input
          value={email}
          onChange={handleChange}
          name="email"
          className="form__input form__input_type_email"
          type="email"
          placeholder="Email"
          autoComplete="email"
        >
        </input>

        <input
          value={password}
          onChange={handleChange}
          name="password"
          className="form__input form__input_type_password"
          type="password"
          placeholder="Пароль"
          autoComplete="new-password"
        >
        </input>

      </Form>
      <p className="register__already">
        Уже зарегистрированы?
        <Link to="/sign-in" className="register__already register__signin-link">Войти</Link>
      </p>

    </section>
  )
}
export default Register;