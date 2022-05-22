import React from 'react';

function ImagePopup(props) {
  return (
    <div
      className={`popup ${props.card && 'popup_opened'}`}
    >

      <div className="popup__overlay"></div>
      <div className="popup__content popup__content_type_photo">
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close-button"
        >
        </button>
        <img
          className="popup__full-photo"
          src={props.card?.link}
          alt={props.card?.name}
        />
        <p className="popup__caption">
          {props.card?.name}
        </p>
      </div>
    </div>

  )
}

export default ImagePopup;