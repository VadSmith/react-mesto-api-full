function PopupWithForm(props) {
  return (
    <div className={props.isOpen
      ? `popup popup_type_${props.name} popup_opened`
      : `popup popup_type_${props.name}`}>
      <div className="popup__overlay"></div>
      <div className="popup__content">
        <button onClick={props.onClose} type="button" className="popup__close-button">
        </button>
        <h2 className="popup__title">{props.title}</h2>
        <form
          onSubmit={props.onSubmit}
          action="index.html"
          className={`popup__form popup__form_type_${props.name}`}
          name={`${props.name}-form`}
        >
          {props.children}
          <button type="submit" className="popup__button">{props.buttonText}</button>
        </form>
      </div>
    </div>

  )
}
export default PopupWithForm;