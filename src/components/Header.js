import { Link, Route } from "react-router-dom";

export default function Header({email, onLogout}) {
  function handleLogOut() {
    onLogout();
  }

  return (
    <header className="header">
      <div className="header__logo"></div>
      <nav className="header__navbar">
        <p className="header__email">{email}</p>
        <Route path="/sign-in">
          <Link to="/sign-up" className="header__link">Регистрация</Link>
        </Route>
        <Route path="/sign-up">
          <Link to="/sign-in" className="header__link">Вход</Link>
        </Route>
        <Route exact path='/'>
          <Link to="/sign-in" className="header__link" onClick={handleLogOut}>Выйти</Link>
        </Route>
      </nav>
    </header>
  )
}