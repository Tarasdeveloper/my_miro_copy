import { Link } from "react-router-dom";
import { AuthLayout } from "./ui/auth-layout";
import { ROUTES } from "@/shared/model/routes";
import RegisterForm from "./ui/register-form";

function RegisterPage() {
  return (
    <div>
      <AuthLayout
        title="Регистрация"
        description="Введите свои учетные данные для входа"
        form={<RegisterForm />}
        footerText={
          <>
            Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
          </>
        }
      />
    </div>
  );
}

export const Component = RegisterPage;
