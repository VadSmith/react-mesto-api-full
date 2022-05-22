import { Link, Switch } from "react-router-dom";
import { Route } from "react-router-dom";

function Navbar(props) {
  return (
    <nav className="navbar header__navbar">
      {props.loggedIn
        ? (
          <>
            <span className="navbar__email">{props.email}</span>
            <Link to='/sign-in' onClick={props.signOut} className="navbar__link">Выйти</Link>
          </>)
        : (
          <Switch>

            <Route path="/sign-in">
              <Link
                to="/sign-up"
                className="navbar__link"
              // activeClassName="navbar__link_active"
              >
                Регистрация
              </Link>
            </Route>

            <Route path="/sign-up">
              <Link
                to="/sign-in"
                className="navbar__link"
              // activeClassName="navbar__link_active"
              >
                Войти
              </Link>

            </Route>
          </Switch>)
      }

    </nav>
  )
}
export default Navbar;