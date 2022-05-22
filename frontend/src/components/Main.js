import React, { useContext } from 'react';
import Card from './Card.js';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Footer from './Footer.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, cards }) {

  const currentUser = useContext(CurrentUserContext);


  return (
    <main className="content">

      <section className="profile">
        <div onClick={onEditAvatar} className="profile__avatar-overlay">
          <img src={currentUser?.avatar} alt="Фото пользователя" className="profile__avatar" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser?.name}</h1>
          <button onClick={onEditProfile} type="button" className="profile__edit-button">
          </button>
          <p className="profile__occupation">{currentUser?.about}</p>
        </div>
        <button onClick={onAddPlace} type="button" className="profile__add-button">
        </button>
      </section>

      <section className="elements">
        {cards.map(cardJSON => (
          <Card
            card={cardJSON}
            key={cardJSON._id}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />

        ))}
      </section>

      <Footer />


    </main>

  )
}
export default Main;