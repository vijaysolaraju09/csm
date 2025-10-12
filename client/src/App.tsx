import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import DashboardPage from "./pages/DashboardPage";

const App = (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="services">
        <Route index element={<ServicesPage />} />
        <Route path=":id" element={<ServiceDetailPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Route>
  </Routes>
);

export default App;
