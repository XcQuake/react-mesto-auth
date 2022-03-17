import successImage from '../images/success.svg';

export default function InfoTooltip({isOpen, onClose}) {
  const popupClassName = (`popup popup_type_signup-status ${isOpen && 'popup_opened'}`);

  return (
    <div className={popupClassName} >
      <div className="popup__container">
        <div className='popup__tooltip'>
          <button className="button popup__close-button" type="button" aria-label="Закрыть" onClick={onClose}></button>
          <img className='popup__tooltip-image' src={successImage} alt='Успех' />
          <p className="popup__tooltip-text">Вы успешно зарегистрировались!</p>
        </div>
      </div>
    </div>
  )
}