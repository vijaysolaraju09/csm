import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCurrentUser, selectAuth, selectCurrentUser } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import "./PageStyles.css";

const DashboardPage = (): JSX.Element => {
  const user = useAppSelector(selectCurrentUser);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user && auth.token && auth.status !== "loading") {
      void dispatch(fetchCurrentUser());
    }
  }, [auth.status, auth.token, dispatch, user]);

  return (
    <section className="page">
      <h2 className="page__title">Welcome back, {user?.name ?? "team"}!</h2>
      <p className="page__subtitle">
        Here&apos;s a quick overview of your customer success performance this week.
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Renewals pipeline</h3>
          <p className="dashboard-card__metric">$182K</p>
          <p>Forecasted renewals closing in the next 90 days.</p>
          <Link to="/services/1">Optimize onboarding →</Link>
        </div>
        <div className="dashboard-card">
          <h3>Health alerts</h3>
          <p className="dashboard-card__metric">3 at risk</p>
          <p>Accounts with drops in product adoption or engagement.</p>
          <Link to="/services/4">Engage support →</Link>
        </div>
        <div className="dashboard-card">
          <h3>Moments of value</h3>
          <p className="dashboard-card__metric">12 delivered</p>
          <p>Playbook milestones completed across your customer base.</p>
          <Link to="/services">Review services →</Link>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Next best actions</h3>
        <ul>
          <li>Schedule a QBR with Northwind Trading by Friday.</li>
          <li>Share new onboarding guide with Contoso&apos;s champions.</li>
          <li>Prepare renewal proposal draft for Fabrikam Industries.</li>
        </ul>
      </div>

      <div className="dashboard-panel">
        <h3>Team highlights</h3>
        <p>
          {user?.name ?? "Your team"} collaborated on 8 customer touchpoints this week and resolved
          all priority support cases within SLA.
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;
