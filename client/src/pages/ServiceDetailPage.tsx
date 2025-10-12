import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { servicesApi } from "../api/services";
import type { Service } from "../types/service";
import "./PageStyles.css";

const ServiceDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Missing service identifier.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchService = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await servicesApi.getServiceById(id);
        if (isMounted) {
          setService(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Unable to load service.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="page">
        <p className="page__status">Loading service...</p>
      </section>
    );
  }

  if (error || !service) {
    return (
      <section className="page page--narrow">
        <h2 className="page__title">Service not found</h2>
        <p className="page__subtitle">{error ?? "We couldn&apos;t find the requested service."}</p>
        <button className="button button--outline" onClick={() => navigate(-1)} type="button">
          Go back
        </button>
      </section>
    );
  }

  return (
    <section className="page page--narrow">
      <h2 className="page__title">{service.name}</h2>
      <p className="page__subtitle">{service.description}</p>
      <div className="service-detail">
        <h3>What&apos;s included</h3>
        <ul>
          {service.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="service-detail__cta">
          <span className="service-card__price">${service.price}/month</span>
          <button className="button button--primary" onClick={() => navigate("/signup")} type="button">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailPage;
