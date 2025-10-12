import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, selectAuth, selectIsAuthenticated, signupUser } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import type { SignupPayload } from "../types/auth";
import "./PageStyles.css";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const emailRegex = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/;

const SignupPage = (): JSX.Element => {
  const [formState, setFormState] = useState<SignupPayload>({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = (values: SignupPayload): FormErrors => {
    const errors: FormErrors = {};
    if (!values.name.trim()) {
      errors.name = "Name is required.";
    }
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
      void dispatch(signupUser(formState));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <section className="page page--narrow">
      <h2 className="page__title">Create your free account</h2>
      <p className="page__subtitle">
        Launch a collaborative workspace for your whole success org in minutes. No credit card
        required.
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby="name-error"
            placeholder="Casey Morgan"
            required
          />
          {formErrors.name && (
            <p id="name-error" className="form__error">
              {formErrors.name}
            </p>
          )}
        </div>
        <div className="form__group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            aria-invalid={Boolean(formErrors.email)}
            aria-describedby="signup-email-error"
            placeholder="you@example.com"
            required
          />
          {formErrors.email && (
            <p id="signup-email-error" className="form__error">
              {formErrors.email}
            </p>
          )}
        </div>
        <div className="form__group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            aria-invalid={Boolean(formErrors.password)}
            aria-describedby="signup-password-error"
            placeholder="Create a secure password"
            required
          />
          {formErrors.password && (
            <p id="signup-password-error" className="form__error">
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
          {auth.status === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="form__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
};

export default SignupPage;
