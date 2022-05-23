import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import * as mestoAuth from '../utils/mestoAuth.js';
import InfoToolTip from './InfoToolTip.js';
import successIcon from '../images/successRegistration.png';
import failIcon from '../images/failRegistration.png';


// import PageNotFound from './PageNotFound.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const history = useHistory();

  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [dataInfoToolTip, setDataInfoToolTip] = useState({ message: '', icon: '' });

  useEffect(() => {
    tokenCheck();
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      history.push("/")
    }
  }, [loggedIn, email])

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getMyUserInfo(), api.getInitialCards()])
        .then(([user, cardsRes]) => {
          setCurrentUser(user);
          setCards(cardsRes);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  function handleCardClick(cardJSON) {
    setSelectedCard(cardJSON);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked) // меняем статус лайка на противоположный
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }).catch((err) => { console.log('Ошибка лайка', err) });
  }

  // Удаление карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      }).catch((err) => { console.log('Ошибка удаления карточки ', err) })
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Апдейт данных пользователя
  function handleUpdateUser(userObject) {
    api.setUserInfo(userObject)
      .then(responseUserObject => {
        setCurrentUser({ ...responseUserObject });
      })
      .catch(error => console.log('Ошибка сохранения даных юзера', error))
      .finally(
        closeAllPopups()
      )
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Апдейт аватара пользователя
  function handleUpdateAvatar(avatarUrl) {
    api.editAvatar(avatarUrl)
      .then(responseUserObject => {
        setCurrentUser({ ...responseUserObject });
      })
      .catch(error => console.log('Ошибка сохранения аватара', error))
      .finally(
        closeAllPopups()
      )
  }

  // Добавление карточи
  function handleAddPlace(cardObject) {
    api.addCard(cardObject)
      .then(newCard => {
        setCards([newCard, ...cards]);
      })
      .catch(error => console.log('ОШИБКА добавления места', error))
      .finally(
        closeAllPopups()
      )
  }

  // После удачной регистрации
  useEffect(() => {
    if (!isInfoToolTipOpen && isRegistered) {
      setIsRegistered(false);
      history.push('/sign-in');
    }
  }, [isInfoToolTipOpen]);


  // Регистрация
  function handleRegister(email, password) {
    return mestoAuth.register(email, password).then((res) => {
      setIsRegistered(true);
      setIsInfoToolTipOpen(true);
      setDataInfoToolTip({ message: "Вы успешно зарегистрировались!", icon: successIcon })
    })
      .catch((err) => {
        setIsInfoToolTipOpen(true);
        setDataInfoToolTip({ message: `Что-то пошло не так! Попробуйте ещё раз.`, icon: failIcon })
        console.log(err);
      })
  }

  function handleLogin(email, password) {
    return mestoAuth.login(email, password)
      .then((res) => {
        setLoggedIn(true);
        // setEmail(res.email);
        history.push('/')
      })

      // .then((data) => {
      //   // console.log(data.json());
      //   // if (data.token) {
      //   // localStorage.setItem('jwt', data.token);
      //   setLoggedIn(true);
      //   // }
      // })
      .catch((err) => {
        console.log(err)
        setIsInfoToolTipOpen(true);
        // setDataInfoToolTip({ message: `Что-то пошло не так! ${err.message}`, icon: failIcon })
        setDataInfoToolTip({
          message: `Что-то пошло не так! Попробуйте ещё раз.`,
          icon: failIcon
        })
      })
  }

  // Проверка токена в локальной базе
  function tokenCheck() {
    // if (loggedIn) {
      mestoAuth.getMyInfo()
        .then((res) => {
          setEmail(res.email);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.log(err);
        });
    // }
  }

  // Разлогиниться
  function signOut() {
    mestoAuth.logout().then(() => {
      setLoggedIn(false);
      setCurrentUser({ name: '', about: '', avatar: '', _id: '' });
      setEmail('');
      history.push('/sign-in');
    }).catch(err => console.log);
  }


  // Закрыть все попапы
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setDataInfoToolTip({ message: '', icon: '' });
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header
          loggedIn={loggedIn}
          signOut={signOut}
          email={email}
        />

        <Switch>

          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />


          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
            <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              dataInfoToolTip={dataInfoToolTip}
            // isRegistered={isRegistered}

            />
          </Route>

          <Route path="/sign-in">
            <Login
              handleLogin={handleLogin}
            />
            <InfoToolTip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              dataInfoToolTip={dataInfoToolTip}
            />

          </Route>

          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>

        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlace}
          onClose={closeAllPopups}
        >
        </AddPlacePopup>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />


      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;
