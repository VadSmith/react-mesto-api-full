import React, { useRef } from 'react';
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
    avatarRef.current.value = '';
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      buttonText="Сохранить"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
    >
      <input
        required
        ref={avatarRef}
        type="url"
        name="avatar"
        id="avatar"
        className="popup__input popup__input_type_link"
        placeholder="Ссылка на картинку"
      />

      <span
        id="avatar-error"
        className="popup__error"
      >
      </span>
    </PopupWithForm>


  )
}