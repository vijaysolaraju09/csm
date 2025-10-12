import { Link } from "react-router-dom";
import "./PageStyles.css";

const HomePage = (): JSX.Element => (
  <section className="page page--center">
    <div className="hero">
      <p className="hero__eyebrow">Customer Success Management</p>
      <h1 className="hero__title">Operational excellence for modern success teams</h1>
      <p className="hero__subtitle">
        CSM helps you streamline onboarding, monitor customer health, and collaborate with your
        entire go-to-market team.
      </p>
      <div className="hero__actions">
        <Link to="/signup" className="button button--primary">
          Start free trial
        </Link>
        <Link to="/services" className="button button--outline">
          Explore services
        </Link>
      </div>
    </div>
    <div className="hero__metrics">
      <div>
        <span className="metric__value">98%</span>
        <span className="metric__label">Renewal rate</span>
      </div>
      <div>
        <span className="metric__value">4x</span>
        <span className="metric__label">Faster onboarding</span>
      </div>
      <div>
        <span className="metric__value">24/7</span>
        <span className="metric__label">Dedicated coverage</span>
      </div>
    </div>
  </section>
);

export default HomePage;
