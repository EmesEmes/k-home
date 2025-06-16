const CanceledPayment = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-red-600">Pago cancelado ❌</h2>
      <p className="mt-2">El pago fue cancelado o no se completó.</p>
      <p className="mt-1">Puedes intentarlo nuevamente cuando estés listo.</p>
    </div>
  );
};

export default CanceledPayment;