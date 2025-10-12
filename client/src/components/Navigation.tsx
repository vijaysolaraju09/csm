import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectIsAuthenticated } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import "./Navigation.css";

const Navigation = (): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClassName = ({ isActive }: { isActive: boolean }): string =>
    isActive ? "active" : "";

  return (
    <header className="navigation">
      <nav className="navigation__container">
        <button className="navigation__brand" onClick={() => navigate("/")} type="button">
          CSM
        </button>
        <div className="navigation__links">
          <NavLink to="/" className={linkClassName} end>
            Home
          </NavLink>
          <NavLink to="/services" className={linkClassName}>
            Services
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClassName}>
                Dashboard
              </NavLink>
              <button className="navigation__logout" onClick={handleLogout} type="button">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClassName}>
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `button ${isActive ? "button--primary" : "button--outline"}`.trim()
                }
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
