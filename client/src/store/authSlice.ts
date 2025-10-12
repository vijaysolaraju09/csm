import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "../types/auth";
import { authApi } from "../api/auth";
import type { AxiosError } from "axios";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  user: User | null;
  token: string | null;
  status: RequestStatus;
  error: string | null;
}

const getStoredItem = (key: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Unable to read from storage", error);
    return null;
  }
};

const setStoredItem = (key: string, value: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn("Unable to write to storage", error);
  }
};

const storedToken = getStoredItem("authToken");
const storedUser = getStoredItem("authUser");

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken,
  status: "idle",
  error: null,
};

type RejectValue = string;

const handleAxiosError = (error: unknown, defaultMessage: string): RejectValue => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? axiosError.message ?? defaultMessage;
};

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: RejectValue }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, "Unable to log in."));
    }
  },
);

export const signupUser = createAsyncThunk<AuthResponse, SignupPayload, { rejectValue: RejectValue }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.signup(payload);
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, "Unable to create account."));
    }
  },
);

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: RejectValue }>(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, "Unable to fetch user."));
    }
  },
);

const persistAuth = (token: string | null, user: User | null): void => {
  setStoredItem("authToken", token);
  setStoredItem("authUser", user ? JSON.stringify(user) : null);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      persistAuth(null, null);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        persistAuth(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to log in.";
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        persistAuth(action.payload.token, action.payload.user);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to create account.";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        if (state.token) {
          persistAuth(state.token, action.payload);
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to fetch user.";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }): AuthState => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => Boolean(state.auth.token && state.auth.user);
export const selectCurrentUser = (state: { auth: AuthState }): User | null => state.auth.user;

export default authSlice.reducer;
