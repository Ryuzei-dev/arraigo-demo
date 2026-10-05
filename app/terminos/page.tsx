import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio web de Arraigo.",
};

export default function Terminos() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y condiciones"
      updated="Julio 2026"
      intro="Al utilizar el sitio web de Arraigo aceptas los siguientes términos. Te recomendamos leerlos; describen el alcance de la información publicada y las condiciones de uso del sitio."
      sections={[
        {
          h: "Uso del sitio",
          p: [
            "El contenido de este sitio tiene fines informativos. La navegación implica la aceptación de estos términos y del aviso de privacidad.",
          ],
        },
        {
          h: "Información de las propiedades",
          p: [
            "Los precios, medidas, imágenes y características de las propiedades son de carácter referencial y pueden cambiar sin previo aviso.",
            "La información definitiva de cada inmueble se confirma directamente con tu asesor antes de cualquier operación.",
          ],
        },
        {
          h: "Propiedad intelectual",
          p: [
            "La marca, el diseño y los contenidos del sitio son propiedad de Arraigo o de sus titulares. No está permitida su reproducción sin autorización.",
          ],
        },
        {
          h: "Limitación de responsabilidad",
          p: [
            "Arraigo no se responsabiliza por decisiones tomadas únicamente con base en la información del sitio sin la asesoría correspondiente.",
          ],
        },
        {
          h: "Contacto",
          p: [
            "Para cualquier duda sobre estos términos, escríbenos a contacto@arraigo.example.",
          ],
        },
      ]}
    />
  );
}
