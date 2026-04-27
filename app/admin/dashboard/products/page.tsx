"use client";

import { useProductsContext } from "@/app/context/ProductsContext";
import { Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { CldUploadWidget } from "next-cloudinary";
import { InputConfig } from "@/app/types/ui";
import DynamicFormFields from "@/app/components/molecules/DynamicFormFields";

const productFields: InputConfig[] = [
  {
    name: "name",
    label: "Nombre",
    placeholder: "Nombre del producto",
    required: true,
  },
  {
    name: "code",
    label: "Código",
    placeholder: "COD-001",
    required: true,
  },
  {
    name: "description",
    label: "Descripción",
    placeholder: "Descripción opcional",
    type: "textarea",
  },
  {
    name: "category",
    label: "Categoría",
    placeholder: "Categoría",
    required: true,
  },
  {
    name: "stock",
    type: "number",
    label: "Stock",
    required: true,
  },
  {
    name: "minStock",
    type: "number",
    label: "Stock mínimo",
    required: true,
  },
  {
    name: "unitPrice",
    type: "number",
    label: "Precio unitario",
    required: true,
  },
];

const productSchema = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  code: Yup.string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .required("El código es obligatorio"),
  description: Yup.string().max(500, "La descripción es demasiado larga"),
  stock: Yup.number()
    .typeError("El stock debe ser numérico")
    .min(0, "El stock no puede ser negativo")
    .required("El stock es obligatorio"),
  minStock: Yup.number()
    .typeError("El mínimo de stock debe ser numérico")
    .min(0, "El mínimo de stock no puede ser negativo")
    .required("El mínimo de stock es obligatorio"),
  unitPrice: Yup.number()
    .typeError("El precio debe ser numérico")
    .moreThan(0, "El precio debe ser mayor a 0")
    .required("El precio unitario es obligatorio"),
  category: Yup.string().required("La categoría es obligatoria"),
});

const ProductsPage = () => {
  const {
    products,
    editingProduct,
    isLoading,
    createProduct,
    updateProduct,
    deactivateProduct,
    startEditingProduct,
    cancelEditingProduct,
  } = useProductsContext();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">CRUD de productos</h1>
        <p className="text-sm text-white/60">
          Crea, edita y desactiva productos con validaciones.
        </p>
      </header>

      <Formik
        enableReinitialize
        initialValues={{
          name: editingProduct?.name ?? "",
          code: editingProduct?.code ?? "",
          description: editingProduct?.description ?? "",
          stock: editingProduct?.stock ?? 0,
          minStock: editingProduct?.minStock ?? 0,
          unitPrice: editingProduct?.unitPrice ?? 0,
          category: editingProduct?.category ?? "",
          image: editingProduct?.image ?? "",
        }}
        validationSchema={productSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const payload = {
              ...values,
              stock: Number(values.stock),
              minStock: Number(values.minStock),
              unitPrice: Number(values.unitPrice),
            };

            if (editingProduct) {
              await updateProduct(editingProduct.id, payload);
              cancelEditingProduct();
              toast.success("Producto actualizado correctamente");
            } else {
              await createProduct(payload);
              toast.success("Producto creado correctamente");
            }

            resetForm({
              values: {
                name: "",
                code: "",
                description: "",
                stock: 0,
                minStock: 0,
                unitPrice: 0,
                category: "",
                image: "",
              },
            });
          } catch {
            toast.error("No se pudo guardar el producto en base de datos");
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
          resetForm,
          isSubmitting,
          setFieldValue,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 p-4"
          >
            <DynamicFormFields fields={productFields} />

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-white/80">Imagen del producto</label>
              <div className="flex items-center gap-6 p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="relative group">
                  {values.image ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-blue-500/30">
                      <img
                        src={values.image}
                        alt="Preview"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFieldValue("image", "")}
                          className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transform scale-0 group-hover:scale-100 transition-transform"
                          title="Eliminar imagen"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-medium uppercase">Sin imagen</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-white">Subir archivo</h4>
                  <p className="text-xs text-white/40 max-w-[200px]">Sube una imagen para tu producto. Se recomienda 800x800px.</p>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                    onSuccess={(result: any) => {
                      setFieldValue("image", result.info.secure_url);
                      toast.success("Imagen subida correctamente");
                    }}
                    onError={(error: any) => {
                      console.error("Cloudinary Error:", error);
                      toast.error("Error al subir la imagen. Verifica el Upload Preset.");
                    }}
                    options={{
                      maxFiles: 1,
                      clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors border border-white/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {values.image ? "Cambiar imagen" : "Seleccionar imagen"}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-60"
              >
                {isLoading
                  ? "Guardando..."
                  : editingProduct
                    ? "Actualizar producto"
                    : "Crear producto"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
                  onClick={() => {
                    cancelEditingProduct();
                    resetForm();
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
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Código</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="p-3 text-white/60" colSpan={7}>
                  No hay productos aún.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-white/10">
                  <td className="p-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover border border-white/10"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/40">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.code}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">${product.unitPrice.toFixed(2)}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.active ? "Activo" : "Inactivo"}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/5"
                      onClick={() => startEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-400/40 px-3 py-1 text-red-300 hover:bg-red-500/10"
                      onClick={async () => {
                        try {
                          await deactivateProduct(product.id);
                          toast.success("Producto desactivado");
                        } catch {
                          toast.error("No se pudo desactivar el producto");
                        }
                      }}
                    >
                      Desactivar
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

export default ProductsPage;