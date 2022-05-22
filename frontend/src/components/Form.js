import React, { Link } from 'react-router-dom';

function Form(props) {
  return (
    <>
      <h2 className="form__caption header__form">{props.caption}</h2>

      <form onSubmit={props.onSubmit} className="form form__form-element">
        {props.children}
        <button type="submit" className="form__button">{props.buttonText}</button>

      </form>
    </>
  )
}
export default Form;