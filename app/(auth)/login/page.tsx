import LoginForm from "@/modules/auth/components/login-form";
import React from "react";
import { requireUnAuthenticated } from "@/modules/auth/utils/auth-utils";

const LoginPage = async () => {
  await requireUnAuthenticated();
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
