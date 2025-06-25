/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  sex: string;
  birthday: {
    city: string;
    date: string;
    country: string;
  };
  phones: {
    phone_1: string;
    phone_2: string;
    landline: string;
  };
  address: {
    city: string;
    po_box: string;
    region: string;
    street: string;
    country: string;
  };
  email_confirmed: boolean;
  preferences: {
    school_id: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser(token)
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          Cookies.remove("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/user_home`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data.user;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const { bearer_token } = response.data;
      Cookies.set("token", bearer_token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      const userData = await fetchUser(bearer_token);
      setUser(userData);
    } catch (error) {
      throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
