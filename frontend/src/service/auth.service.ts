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

const AuthService = { login, logout };

export default AuthService;
