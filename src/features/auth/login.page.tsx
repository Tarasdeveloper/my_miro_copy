import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import LoginForm from "./login-form";

function LoginPage() {
  return (
    <AuthLayout
      title="Вход в систему"
      description="Введите свои учетные данные для входа"
      form={<LoginForm />}
      footerText={
        <>
          Нет учетной записи?{" "}
          <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
        </>
      }
    />
  );
}

export const Component = LoginPage;
