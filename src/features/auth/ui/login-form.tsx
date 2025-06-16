import { Button } from "@/shared/ui/kit/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../model/use-login";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email обязателен" })
    .email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { errorMessage, isPending, login } = useLogin();

  const onSubmit = form.handleSubmit(login);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@mail.com" type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*******" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}
        <Button disabled={isPending} type="submit">
          Войти
        </Button>
      </form>
    </Form>
  );
}
