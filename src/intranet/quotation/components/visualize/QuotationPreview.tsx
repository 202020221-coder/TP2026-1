import { formatCurrency } from "@/shared/lib/format-currency";
import CompanyLogo from "./pdf/images/engineer-fire-logo.jpg";
import type { QuotationPreviewData } from "./PdfPreview";

const SectionCard = ({
  title,
  accent = "navy",
  children,
}: {
  title: string;
  accent?: "navy" | "red";
  children: React.ReactNode;
}) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
    <div
      className={`px-4 py-2.5 ${
        accent === "red" ? "bg-red-700" : "bg-slate-800"
      }`}
    >
      <h3 className="text-xs font-bold text-white tracking-wide uppercase">
        {title}
      </h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const DataRow = ({
  label,
  value,
  labelWidth = "w-1/3",
}: {
  label: string;
  value: string;
  labelWidth?: string;
}) => (
  <div className="flex items-start gap-2 mb-1.5">
    <span className={`${labelWidth} text-xs text-slate-500 shrink-0`}>
      {label}
    </span>
    <span className="text-xs text-slate-800 font-semibold">{value}</span>
  </div>
);

const QuotationPreview = ({ data }: { data: QuotationPreviewData }) => {
  const { inventory, truck, pickup, conditions } = data;
  const rows = Object.values(inventory);
  const subtotal = rows.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0,
  );
  const total = subtotal + (pickup?.pickupCost || 0);

  return (
    <div className="bg-white max-w-[210mm] mx-auto shadow-lg rounded-xl overflow-hidden">
      <div className="h-1 bg-red-700" />

      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <img
            src={CompanyLogo}
            alt="Engineer Fire"
            className="h-20 w-20 object-contain"
          />
          <div className="text-right">
            <h1 className="text-lg font-black text-red-700 tracking-tight">
              COTIZACIÓN PROPUESTA
            </h1>
            <p className="text-[10px] text-slate-500 mt-0.5 max-w-md leading-relaxed">
              Reciba nuestros cordiales saludos. A continuación, presentamos la
              propuesta técnica-económica solicitada.
            </p>
            <div className="flex justify-end gap-3 mt-1.5 text-[9px] text-slate-400">
              <span>ENGINEER FIRE S.A.</span>
              <span className="text-slate-300">|</span>
              <span>RUC: 20501234567</span>
              <span className="text-slate-300">|</span>
              <span>Protección Profesional Contra Incendios</span>
            </div>
          </div>
        </div>

        <div className="border-b-2 border-red-700 mb-6" />

        <div className="space-y-5">
          <SectionCard title="Productos y Servicios">
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left py-2 px-3 font-semibold w-[40%]">
                      Producto
                    </th>
                    <th className="text-center py-2 px-3 font-semibold w-[15%]">
                      Cant.
                    </th>
                    <th className="text-right py-2 px-3 font-semibold w-[22%]">
                      P. Unitario
                    </th>
                    <th className="text-right py-2 px-3 font-semibold w-[23%]">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }
                    >
                      <td className="py-2 px-3 text-slate-800">{item.nombre}</td>
                      <td className="py-2 px-3 text-center text-slate-800">
                        {item.cantidad}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-800">
                        {formatCurrency(item.precio_unitario, "USD", 2)}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-800 font-medium">
                        {formatCurrency(
                          item.cantidad * item.precio_unitario,
                          "USD",
                          2,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Camión y Conductor Asignado">
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <DataRow label="Placa:" value={truck?.Placa} />
                <DataRow
                  label="Modelo:"
                  value={`${truck?.modelo} (${truck?.ano_fabricacion})`}
                />
                <DataRow label="Color:" value={truck?.color} />
              </div>
              <div>
                <DataRow
                  label="Próx. Revisión:"
                  value={truck?.fecha_prox_revision}
                />
                <DataRow
                  label="Características:"
                  value={truck?.caracteristicas}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Servicio de Recojo">
            <div className="grid grid-cols-2 gap-x-8">
              <DataRow label="Fecha de Recojo:" value={pickup?.pickupDate} />
              <DataRow
                label="Costo de Recojo:"
                value={formatCurrency(pickup?.pickupCost, "USD", 2)}
              />
              {pickup?.pickupAddress && (
                <div className="col-span-2">
                  <DataRow
                    label="Dirección:"
                    value={pickup.pickupAddress}
                    labelWidth="w-[15%]"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Condiciones de la Cotización">
            <div className="flex gap-8 mb-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">
                  Fecha de Emisión
                </p>
                <p className="text-xs text-slate-800 font-bold">
                  {conditions.emissionDate}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">
                  Fecha de Expiración
                </p>
                <p className="text-xs text-slate-800 font-bold">
                  {conditions.expirationDate}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {conditions.conditions}
              </p>
            </div>
            {conditions.observaciones && (
              <div className="mt-3">
                <p className="text-[11px] font-bold text-slate-800 mb-1">
                  Observaciones
                </p>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {conditions.observaciones}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Resumen de Costos" accent="red">
            <div className="max-w-[280px] ml-auto">
              <div className="flex justify-between py-1">
                <span className="text-xs text-slate-500">
                  Subtotal Inventario:
                </span>
                <span className="text-xs text-slate-800">
                  {formatCurrency(subtotal, "USD", 2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-slate-500">
                  Costo de Recojo:
                </span>
                <span className="text-xs text-slate-800">
                  {formatCurrency(pickup?.pickupCost ?? 0, "USD", 2)}
                </span>
              </div>
              <div className="border-t border-slate-200 my-1" />
              <div className="flex justify-between py-1">
                <span className="text-sm font-bold text-red-700">TOTAL:</span>
                <span className="text-sm font-bold text-red-700">
                  {formatCurrency(total, "USD", 2)}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between text-[9px] text-slate-400">
          <span>ENGINEER FIRE S.A. - RUC: 20501234567</span>
          <span>Cotización generada - Documento interno</span>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;
