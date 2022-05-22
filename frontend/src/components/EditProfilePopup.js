import React, { useEffect, useState, useContext } from 'react';
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from '../contexts/CurrentUserContext';

export default function EditProfilePopup(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // Подписка на контекст
  const currentUser = useContext(CurrentUserContext);

  // обработка поля имени
  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }
  // обработка поля описания
  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (

    <PopupWithForm
      title="Редактировать профиль"
      name="edit"
      buttonText="Сохранить"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
    >
      <input
        value={name}
        onChange={handleNameChange}
        name="name"
        id="name-input"
        className="popup__input popup__input_type_name"
        placeholder="Имя"
        minLength="2"
        maxLength="40"
        type="text"
        required
        autoFocus
      />
      <span
        id="name-input-error"
        className="popup__error"
      >
      </span>
      <input
        value={description}
        onChange={handleDescriptionChange}
        required
        minLength="2"
        maxLength="200"
        type="text"
        name="about"
        id="occupation-input"
        className="popup__input popup__input_type_job"
        placeholder="Работа"
      />
      <span
        id="occupation-input-error"
        className="popup__error"
      >
      </span>
    </PopupWithForm>
  )
}
