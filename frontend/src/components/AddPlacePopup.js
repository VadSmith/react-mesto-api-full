import React, { useRef } from 'react';
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
  const cardNameRef = useRef();
  const cardLinkRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlace({
      name: cardNameRef.current.value,
      link: cardLinkRef.current.value
    });
    cardNameRef.current.value = '';
    cardLinkRef.current.value = '';
  }
  return (
    <PopupWithForm
      title="Новое место"
      name="add"
      buttonText="Сохранить"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
    >
      <input
        ref={cardNameRef}
        // onChange={handleCardNameChange}
        type="text"
        name="place"
        id="place"
        className="popup__input popup__input_type_place"
        placeholder="Название"
        autoFocus
        minLength="2"
        maxLength="30"
        required
      />
      <span
        id="place-error"
        className="popup__error">
      </span>
      <input
        ref={cardLinkRef}
        // onChange={handleCardLinkChange}
        type="url"
        name="link"
        id="link"
        className="popup__input popup__input_type_link"
        placeholder="Ссылка на картинку"
        required
      />
      <span
        id="link-error"
        className="popup__error"
      >
      </span>
    </PopupWithForm>


  )
}