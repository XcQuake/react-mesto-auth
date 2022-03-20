import { useHistory } from 'react-router-dom';

export default function InfoTooltip({isOpen, onClose, authSuccess}) {
  const popupClassName = (`popup popup_type_signup-status ${isOpen && 'popup_opened'}`);
  const history = useHistory();
  const imageClassName = (
    `popup__tooltip-image ${authSuccess ? 'popup__tooltip-image_type_success' : 'popup__tooltip-image_type_error' }`
  );
  const statusText = (
    `${authSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}`
  );
  
  function handleClose() {
    if (authSuccess) {
      history.push('/sign-in');
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div className={popupClassName} >
      <div className="popup__container">
        <div className='popup__tooltip'>
          <button className="button popup__close-button" type="button" aria-label="Закрыть" onClick={handleClose}></button>
          <div className={imageClassName}></div>
          <p className="popup__tooltip-text">{statusText}</p>
        </div>
      </div>
    </div>
  )
}