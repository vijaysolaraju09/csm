import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, loginUser, selectAuth, selectIsAuthenticated } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import type { LoginPayload } from "../types/auth";
import "./PageStyles.css";

interface FormErrors {
  email?: string;
  password?: string;
}

const emailRegex = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/;

const LoginPage = (): JSX.Element => {
  const [formState, setFormState] = useState<LoginPayload>({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const fromPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? "/dashboard";
  }, [location.state]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const validate = (values: LoginPayload): FormErrors => {
    const errors: FormErrors = {};
    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!values.password.trim()) {
      errors.password = "Password is required.";
    } else if (values.password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    return errors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const errors = validate(formState);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      void dispatch(loginUser(formState));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <section className="page page--narrow">
      <h2 className="page__title">Log in to your account</h2>
      <p className="page__subtitle">
        Welcome back! Access your dashboard to track renewals, health scores, and customer moments
        that matter.
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            aria-invalid={Boolean(formErrors.email)}
            aria-describedby="email-error"
            placeholder="you@example.com"
            required
          />
          {formErrors.email && (
            <p id="email-error" className="form__error">
              {formErrors.email}
            </p>
          )}
        </div>
        <div className="form__group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            aria-invalid={Boolean(formErrors.password)}
            aria-describedby="password-error"
            placeholder="Enter your password"
            required
          />
          {formErrors.password && (
            <p id="password-error" className="form__error">
              {formErrors.password}
            </p>
          )}
        </div>
        {auth.error && <p className="form__alert">{auth.error}</p>}
        <button
          className="button button--primary form__submit"
          type="submit"
          disabled={auth.status === "loading"}
        >
          {auth.status === "loading" ? "Signing in..." : "Log in"}
        </button>
      </form>
      <p className="form__footer">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  );
};

export default LoginPage;
