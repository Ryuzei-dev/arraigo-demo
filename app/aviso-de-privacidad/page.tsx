import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Arraigo conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
};

export default function AvisoPrivacidad() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Aviso de privacidad"
      updated="Julio 2026"
      intro="En Arraigo protegemos tus datos personales. Este aviso describe qué información recabamos, para qué la usamos y cómo puedes ejercer tus derechos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)."
      sections={[
        {
          h: "Responsable",
          p: [
            "Arraigo, con domicilio en Uruapan, Michoacán, México, es responsable del tratamiento y protección de tus datos personales conforme al presente aviso.",
          ],
        },
        {
          h: "Datos que recabamos",
          p: [
            "Podemos recabar tu nombre, teléfono, correo electrónico y la información que nos compartas sobre tu intención de compra, venta o renta de inmuebles.",
            "No solicitamos datos personales sensibles a través del sitio web.",
          ],
        },
        {
          h: "Finalidades",
          p: [
            "Utilizamos tus datos para contactarte, brindarte asesoría inmobiliaria, presentarte propiedades acordes a tu búsqueda y dar seguimiento a tu operación.",
            "De manera secundaria, podríamos informarte sobre nuevas propiedades o servicios. Puedes oponerte a estos usos en cualquier momento.",
          ],
        },
        {
          h: "Transferencias",
          p: [
            "No transferimos tus datos a terceros sin tu consentimiento, salvo cuando sea necesario para concretar una operación (por ejemplo, notarías o instituciones de crédito) o cuando la ley lo requiera.",
          ],
        },
        {
          h: "Derechos ARCO",
          p: [
            "Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos, así como a revocar tu consentimiento.",
            "Para ejercerlos, escríbenos a contacto@arraigo.example indicando tu solicitud.",
          ],
        },
        {
          h: "Cambios al aviso",
          p: [
            "Este aviso puede actualizarse. Publicaremos cualquier cambio en esta misma página.",
          ],
        },
      ]}
    />
  );
}
