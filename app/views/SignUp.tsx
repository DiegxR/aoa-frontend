"use client";
import { useForm, FormProvider } from "react-hook-form";
import SignTemplate from "@/app/components/templates/SignTemplate";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { hydrateFromStorage } from "@/lib/features/authSlice";
import { toast } from "react-hot-toast";
import { InputConfig } from "@/app/types/ui";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { registerUser, isLoading } = useAuth();

  const methods = useForm<SignUpFormData>({
    mode: "onBlur",
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const authResponse = await registerUser(
        data.name,
        data.email,
        data.password,
      ).unwrap();
      localStorage.setItem("token", authResponse.token);
      localStorage.setItem("user", JSON.stringify(authResponse.user));
      dispatch(hydrateFromStorage());

      await fetch("/api/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authResponse.token }),
      });

      router.push("/");
    } catch (error) {
      toast.error("No se pudo completar el registro. Intenta de nuevo.");
      console.error("Error en registro:", error);
    }
  };

  const signUpInputs: InputConfig[] = [
    {
      name: "name",
      type: "text",
      label: "Nombre completo",
      required: true,
      validation: {
        required: "El nombre es requerido",
        minLength: {
          value: 2,
          message: "El nombre debe tener al menos 2 caracteres",
        },
      },
    },
    {
      name: "email",
      type: "email",
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
      label: "Contraseña",
      required: true,
      validation: {
        required: "La contraseña es requerida",
        minLength: {
          value: 6,
          message: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirmar contraseña",
      required: true,
      validation: {
        required: "Debes confirmar tu contraseña",
        validate: (value: string, formValues: SignUpFormData) =>
          value === formValues.password || "Las contraseñas no coinciden",
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <SignTemplate
        title="Crear cuenta"
        subtitle="Regístrate para continuar"
        inputs={signUpInputs}
        submitText="Registrarse"
        isLoading={isLoading}
        onSubmit={handleSubmit(onSubmit)}
        alternateLink={{
          text: "¿Ya tienes una cuenta?",
          linkText: "Inicia sesión",
          path: "/",
        }}
        footerText="Al registrarte, aceptas nuestros términos y política de privacidad"
      />
    </FormProvider>
  );
};

export default SignUp;