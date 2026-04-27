"use client";
import { FormProvider, useForm } from "react-hook-form";
import SignTemplate from "../components/SignTemplate";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "@/lib/store/hooks";
import { hydrateFromStorage } from "@/lib/features/authSlice";
import { setUsers } from "@/lib/features/usersSlice";
import { createClientClient } from "@/lib/graphql/client";
import { USERS_QUERY } from "@/lib/graphql/queries";
import { toast } from "react-hot-toast";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {

  const dispatch = useAppDispatch();
  const { loginUser, isLoading } = useAuth();
  const methods = useForm<SignInFormData>({
    mode: "onBlur",
  });
  const { handleSubmit } = methods;

  const loginInputs = [
    {
      name: "email",
      type: "email",
      icon: "icon-[solar--user-bold]",
      placeholder: "correo@ejemplo.com",
      label: "Correo electrónico",
      required: true,
      validation: {
        required: "El correo es requerido",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Correo electrónico inválido",
        },
      },
    },
    {
      name: "password",
      type: "password",
      icon: "icon-[material-symbols--password]",
      placeholder: "••••••••",
      label: "Contraseña",
      required: true,
      validation: {
        required: "La contraseña es requerida",
      },
    },
  ];

  const onSubmit = async (data: SignInFormData) => {
    try {
      const authResponse = await loginUser(data.email, data.password).unwrap();

      dispatch(hydrateFromStorage());
      if (authResponse.user.role === "admin") {
        const client = createClientClient();
        const usersData = await client.request(USERS_QUERY);
        const users = (usersData?.users ?? []).map(
          (user: {
            id: string;
            name: string;
            email: string;
            role: "admin" | "user";
            createdBy?: string | null;
          }) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            createdBy: user.createdBy ?? null,
          }),
        );
        dispatch(setUsers(users));
        localStorage.setItem("users", JSON.stringify(users));
      } else {
        dispatch(setUsers([]));
        localStorage.setItem("users", JSON.stringify([]));
      }

       await fetch("/api/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authResponse.token }),
      });
      window.location.reload();
    } catch (error) {
      toast.error("No se pudo iniciar sesión. Verifica tus credenciales.");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="">
      <FormProvider {...methods}>
        <SignTemplate
          title="Bienvenido"
          subtitle="Inicia sesión para continuar"
          inputs={loginInputs}
          submitText="Iniciar sesión"
          isLoading={isLoading}
          onSubmit={handleSubmit(onSubmit)}
          alternateLink={{
            text: "¿No tienes una cuenta?",
            linkText: "Regístrate",
            path: "signup",
          }}
         
        />
      </FormProvider>
    </div>
  );
};

export default SignIn;
