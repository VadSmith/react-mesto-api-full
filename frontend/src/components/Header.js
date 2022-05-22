import logoImg from '../images/logo.svg';
import Navbar from './Navbar';

function Header(props) {
  return (
    <header className="header">

      <img src={logoImg} alt="Логотип сайта Место" className="header__logo" />
      <Navbar
        email={props.email}
        loggedIn={props.loggedIn}
        signOut={props.signOut}
      />
    </header>

  )
}
export default Header;