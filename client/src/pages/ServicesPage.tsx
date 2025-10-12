import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { servicesApi } from "../api/services";
import type { Service } from "../types/service";
import "./PageStyles.css";

const ServicesPage = (): JSX.Element => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await servicesApi.getServices();
        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Unable to load services.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page">
      <h2 className="page__title">Services crafted for the entire success journey</h2>
      <p className="page__subtitle">
        Our modular offerings help you accelerate onboarding, maintain customer health, and drive
        renewals with confidence.
      </p>
      {isLoading && <p className="page__status">Loading services...</p>}
      {error && <p className="form__alert">{error}</p>}
      <div className="services-grid">
        {services.map((service) => (
          <article key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <ul>
              {service.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p className="service-card__price">${service.price}/month</p>
            <Link to={`/services/${service.id}`} className="button button--outline">
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;
