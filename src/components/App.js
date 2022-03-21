import { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth'

function App() {
  // Перменные состояния попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = useState(false);

  // Переменные состояния карточек и информации о пользователе
  const [currentUser, setCurrentUser] = useState({name: 'Жак-Ив Кусто', about: 'Исследователь океана'});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const history = useHistory();

  useEffect(() => {
    api.getFullData()
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch(err => console.log(err));
    
    handleTokenCheck();
  }, []);

  // Функции открытия попапов
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  // Функции аутентификации
  function handleAuth(status) {
    setIsTooltipPopupOpen(true);
    setAuthSuccess(status);
  }

  function handleLogin(email) {
    setEmail(email);
    setLoggedIn(true);
  }

  function handleLogOut() {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('jwt');
  }

  function handleTokenCheck() {
    if (localStorage.getItem('jwt')){
      const jwt = localStorage.getItem('jwt');
      auth.checkToken(jwt)
        .then((data) => {
          if(data.email){
            setEmail(data.email);
            setLoggedIn(true);
            history.push('/')
          }
        })
        .catch(err => console.log(err))
    }
  }

  // Обновление информации о пользователе
  function handleUpdateUser({name, about}) {
    setIsDataLoad(true);

    api.setUserInfo({name, about})
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsDataLoad(false))
  }

  function handleUpdateAvatar(avatar) {
    setIsDataLoad(true);

    api.setUserAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .finally(() => setIsDataLoad(false))
  }

  // Манипуляции с карточкой
  function handleAddPlaceSubmit(newCard) {
    setIsDataLoad(true);

    api.addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => setIsDataLoad(false))
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((oldCard) => 
          oldCard._id === card._id 
          ? newCard 
          : oldCard
        ));
      })
      .catch(err => console.log(err))
  }

  function handleCardDeleteClick(card) {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardDelete(card) {
    setIsDataLoad(true);

    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter(oldCard => oldCard._id !== card._id));
        setIsDataLoad(false)
        closeAllPopups();
      })
      .catch(err => console.log(err))
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
    setIsDeleteCardPopupOpen(false);
    setIsTooltipPopupOpen(false);
    setAuthSuccess(false);
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} email={email} onLogout={handleLogOut}/>
      <Switch>
        <Route path='/sign-in'>
          <Login onFailAuth={handleAuth} onSetLogin={handleLogin}/>
        </Route>
        <Route path='/sign-up'>
          <Register onRegister={handleAuth}/>
        </Route>
        <ProtectedRoute 
          exact path='/'
          onEditProfile = {handleEditProfileClick}
          onAddPlace = {handleAddPlaceClick}
          onEditAvatar = {handleEditAvatarClick}
          onCardClick = {handleCardClick}
          cards = {cards}
          onCardLike = {handleCardLike}
          onCardDelete = {handleCardDeleteClick}
          loggedIn = {loggedIn}
          component = {Main}
        />
      </Switch>
      <Footer />
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isDataLoad={isDataLoad}/>
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isDataLoad={isDataLoad}/>
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isDataLoad={isDataLoad}/>
      <ImagePopup card={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
      <DeleteCardPopup card={selectedCard} isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onDeleteCard={handleCardDelete} isDataLoad={isDataLoad}/>
      <InfoTooltip isOpen={isTooltipPopupOpen} onClose={closeAllPopups} authSuccess={authSuccess}/>
    </CurrentUserContext.Provider>
  );
};

export default App;