"use client";

import Input from "@/app/components/Input";
import { useUsersContext } from "../../../context/UsersContext";
import { Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

const userSchema = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const UsersPage = () => {
  const {
    users,
    editingUser,
    createUser,
    updateUser,
    deleteUser,
    startEditingUser,
    cancelEditingUser,
    isSaving,
  } = useUsersContext();

  return (
    <section className="space-y-6">

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CRUD de usuarios</h1>
          <p className="text-sm text-white/60">
            Crea, edita y elimina usuarios con validaciones.
          </p>
        </div>
      </header>

      <Formik
        enableReinitialize
        initialValues={{
          name: editingUser?.name ?? "",
          email: editingUser?.email ?? "",
          password: editingUser?.password ?? "",
          role: editingUser?.role ?? "user",
        }}
        validationSchema={userSchema}
        onSubmit={async (values, { resetForm }) => {
          if (editingUser) {
            updateUser(editingUser.id, values);
            cancelEditingUser();
            toast.success("Usuario actualizado correctamente");
            resetForm({
              values: {
                name: "",
                email: "",
                password: "",
                role: "user",
              },
            });
            return;
          }

          try {
            await createUser(values);
            toast.success("Usuario creado correctamente");
            resetForm();
          } catch {
            toast.error("Error creando usuario en base de datos");
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          resetForm,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-white/10 p-4"
          >
            <Input
              name="name"
              label="Nombre"
              placeholder="Nombre completo"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.name ? errors.name : undefined}
              fullWidth
            />

            <Input
              name="email"
              type="email"
              label="Correo"
              placeholder="correo@ejemplo.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.email ? errors.email : undefined}
              fullWidth
            />

            <Input
              name="password"
              type="password"
              label="Contraseña"
              placeholder="********"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.password ? errors.password : undefined}
              fullWidth
            />

            <div className="md:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting || isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
              >
                {isSaving
                  ? "Guardando..."
                  : editingUser
                    ? "Actualizar usuario"
                    : "Crear usuario"}
              </button>

              {editingUser && (
                <button
                  type="button"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
                  onClick={() => {
                    cancelEditingUser();
                    resetForm({
                      values: {
                        name: "",
                        email: "",
                        password: "",
                        role: "user",
                      },
                    });
                  }}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        )}
      </Formik>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="p-3 text-white/60" colSpan={4}>
                  No hay usuarios aún.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 uppercase">{user.role}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/5"
                      onClick={() => startEditingUser(user)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-400/40 px-3 py-1 text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        deleteUser(user.id);
                        toast.success("Usuario eliminado");
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
};

export default UsersPage;