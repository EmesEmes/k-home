// src/pages/PagoExitoso.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SuccessfulPayment = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verificarPago = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/payments/verify-session/${sessionId}`);
        const data = await res.json();

        if (res.ok && data.pagoExitoso) {
          setSuccess(true);
          // Puedes hacer más cosas aquí, como mostrar mensaje, actualizar estado, etc.
        } else {
          console.warn("Pago no confirmado");
        }
      } catch (err) {
        console.error("Error verificando el pago:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verificarPago();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) return <p className="text-center mt-10">Verificando pago...</p>;

  return (
    <div className="text-center mt-10">
      {success ? (
        <>
          <h2 className="text-2xl font-bold text-green-600">¡Pago exitoso! 🎉</h2>
          <p className="mt-2">Tu flat ha sido destacado correctamente.</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-red-600">Pago no verificado</h2>
          <p className="mt-2">Si crees que esto es un error, contáctanos.</p>
        </>
      )}
    </div>
  );
};

export default SuccessfulPayment;
