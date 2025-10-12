import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import "./Layout.css";

const Layout = (): JSX.Element => (
  <div className="layout">
    <Navigation />
    <main className="layout__content">
      <Outlet />
    </main>
    <footer className="layout__footer">
      <p>© {new Date().getFullYear()} CSM Platform. All rights reserved.</p>
    </footer>
  </div>
);

export default Layout;
