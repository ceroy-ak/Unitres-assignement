import { http } from "@/http";

const login = async (email: string, password: string) => {
  if (!email || !password) {
    return Promise.reject("Please fill in all fields");
  }
  await http.post("/auth/login", { email, password });
};
const logout = async () => {
  await http.post("/auth/logout");
};

export interface IGetMeDetails {
  name: string;
  email: string;
  showHeader: boolean;
  showMenu: boolean;
  showFooter: boolean;
}

const me = async (): Promise<IGetMeDetails> => {
  const response = await http.get("/auth/me");
  return response.data;
};

const AuthService = { login, logout, me };

export default AuthService;
