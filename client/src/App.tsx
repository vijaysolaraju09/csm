import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
}

function App(): JSX.Element {
  const [health, setHealth] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch("/api/health/");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = (await response.json()) as HealthResponse;
        setHealth(data.status);
      } catch (error) {
        setHealth(`Error: ${(error as Error).message}`);
      }
    }

    void fetchHealth();
  }, []);

  return (
    <main>
      <h1>CSM Monorepo</h1>
      <p>API health: {health}</p>
    </main>
  );
}

export default App;
