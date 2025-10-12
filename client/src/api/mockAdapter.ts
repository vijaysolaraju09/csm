import type {
  AxiosAdapter,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AxiosError } from "axios";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "../types/auth";
import type { Service } from "../types/service";

interface StoredUser extends User {
  password: string;
}

const statusTextMap: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
};

const services: Service[] = [
  {
    id: "1",
    name: "Managed Cloud Hosting",
    description:
      "Reliable infrastructure management for scaling teams that want predictable performance.",
    price: 249,
    features: [
      "24/7 monitoring",
      "Automated backups",
      "Infrastructure as code onboarding",
    ],
  },
  {
    id: "2",
    name: "Customer Success Playbooks",
    description:
      "Tailored enablement plans that help go-to-market teams onboard and retain high-value customers.",
    price: 149,
    features: [
      "Lifecycle mapping workshops",
      "Campaign templates",
      "Quarterly performance reviews",
    ],
  },
  {
    id: "3",
    name: "Analytics Implementation",
    description:
      "End-to-end instrumentation and reporting to give your business realtime feedback loops.",
    price: 329,
    features: [
      "CDP configuration",
      "Executive dashboards",
      "Experimentation framework setup",
    ],
  },
  {
    id: "4",
    name: "Premier Support",
    description:
      "Always-on advisory services with guaranteed SLAs for critical initiatives.",
    price: 499,
    features: [
      "Dedicated success manager",
      "Monthly strategy sessions",
      "Priority escalation",
    ],
  },
];

const storedUsers: Record<string, StoredUser> = {
  "casey@example.com": {
    id: "user-1",
    name: "Casey Morgan",
    email: "casey@example.com",
    password: "password123",
  },
};

let currentUser: StoredUser | null = storedUsers["casey@example.com"];
let currentToken: string | null = currentUser ? `mock-token-${currentUser.id}` : null;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const sanitizeUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const buildResponse = <T>(
  config: AxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> => ({
  data,
  status,
  statusText: statusTextMap[status] ?? "OK",
  headers: {},
  config,
});

const buildError = (
  config: AxiosRequestConfig,
  status: number,
  message: string,
): Promise<never> => {
  const response = buildResponse(config, { message }, status);
  return Promise.reject(new AxiosError(message, undefined, config, undefined, response));
};

const parseBody = <T>(config: AxiosRequestConfig): T => {
  if (!config.data) {
    return {} as T;
  }

  if (typeof config.data === "string") {
    try {
      return JSON.parse(config.data) as T;
    } catch (error) {
      console.warn("Failed to parse mock request body", error);
      return {} as T;
    }
  }

  return config.data as T;
};

const titleCaseFromEmail = (email: string): string => {
  const username = email.split("@")[0] ?? "User";
  return username
    .split(/[._-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const handleLogin = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse<AuthResponse>> => {
  const { email, password } = parseBody<LoginPayload>(config);

  if (!email || !password) {
    return buildError(config, 400, "Email and password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = storedUsers[normalizedEmail];

  if (existingUser) {
    existingUser.password = password;
    currentUser = existingUser;
  } else {
    const newUser: StoredUser = {
      id: `user-${Object.keys(storedUsers).length + 1}`,
      name: titleCaseFromEmail(email.trim()),
      email: email.trim(),
      password,
    };
    storedUsers[normalizedEmail] = newUser;
    currentUser = newUser;
  }

  currentToken = `mock-token-${currentUser.id}`;
  return buildResponse(
    config,
    {
      token: currentToken,
      user: sanitizeUser(currentUser),
    },
    200,
  );
};

const handleSignup = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse<AuthResponse>> => {
  const { name, email, password } = parseBody<SignupPayload>(config);

  if (!name || !email || !password) {
    return buildError(config, 400, "All fields are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (storedUsers[normalizedEmail]) {
    return buildError(config, 400, "An account with that email already exists.");
  }

  const user: StoredUser = {
    id: `user-${Object.keys(storedUsers).length + 1}`,
    name: name.trim(),
    email: email.trim(),
    password,
  };

  storedUsers[normalizedEmail] = user;
  currentUser = user;
  currentToken = `mock-token-${user.id}`;

  return buildResponse(
    config,
    {
      token: currentToken,
      user: sanitizeUser(user),
    },
    201,
  );
};

const handleCurrentUser = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse<User>> => {
  const authHeader = (config.headers?.Authorization ?? config.headers?.authorization) as
    | string
    | undefined;

  if (!authHeader || authHeader !== `Bearer ${currentToken}` || !currentUser) {
    return buildError(config, 401, "Authentication required.");
  }

  return buildResponse(config, sanitizeUser(currentUser), 200);
};

const handleServices = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse<{ services: Service[] }>> =>
  buildResponse(config, { services }, 200);

const handleServiceDetail = async (
  config: AxiosRequestConfig,
): Promise<AxiosResponse<Service>> => {
  const serviceId = config.url?.split("/").pop();
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return buildError(config, 404, "Service not found.");
  }

  return buildResponse(config, service, 200);
};

export const attachMockAdapter = (instance: AxiosInstance): void => {
  const adapter: AxiosAdapter = async (config) => {
    await delay(250);

    const method = (config.method ?? "get").toLowerCase();
    const url = config.url ?? "";

    if (method === "post" && url === "/auth/login") {
      return handleLogin(config);
    }

    if (method === "post" && url === "/auth/signup") {
      return handleSignup(config);
    }

    if (method === "get" && url === "/auth/me") {
      return handleCurrentUser(config);
    }

    if (method === "get" && url === "/services") {
      return handleServices(config);
    }

    if (method === "get" && url.startsWith("/services/")) {
      return handleServiceDetail(config);
    }

    return buildResponse(config, { message: "Not implemented" }, 404);
  };

  instance.defaults.adapter = adapter;
};
