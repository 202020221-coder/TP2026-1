export const DASHBOARD_METRIC_HELP = {
  conversionRate:
    "Porcentaje de cotizaciones aprobadas respecto al total de cotizaciones enviadas al cliente. Un valor bajo sugiere revisar precios, tiempos de respuesta o condiciones comerciales.",
  negotiationAmount:
    "Suma del valor económico de cotizaciones con observaciones del cliente o pendientes de aprobar la orden de compra. Representa ingresos potenciales aún en negociación.",
  netMargin:
    "Diferencia entre el presupuesto estimado y el costo real ejecutado en proyectos activos. Indica qué tan rentable está siendo la operación frente a lo planificado.",
  fleetAvailability:
    "Porcentaje de camiones operativos o en ruta sobre el total de la flota. Valores bajos pueden retrasar entregas y afectar la ejecución de proyectos.",
  commercialFunnel:
    "Muestra el flujo comercial desde solicitudes de clientes hasta proyectos en ejecución. Permite detectar en qué etapa se pierden oportunidades.",
  budgetVsReal:
    "Compara el costo cotizado (estimado) con el gasto real registrado en presupuesto interno. Ayuda a identificar desviaciones antes de que impacten la rentabilidad.",
  globalMerma:
    "Índice de pérdida de material en inventario. Si supera el 10%, se considera crítico y requiere revisión de control de stock y uso en obra.",
  mermaByProject:
    "Variación del gasto en material directo por proyecto respecto a lo presupuestado. Los proyectos en rojo superan el umbral permitido de pérdida.",
  projectTraceability:
    "Distribución de proyectos por estado: pendiente, en ejecución, completado y en proceso legal. Ofrece una vista rápida de la carga operativa.",
  maintenanceDelay:
    "Días de retraso máximo en revisiones técnicas de la flota. Camiones con revisión vencida pueden generar riesgos operativos y legales.",
  activeProjects:
    "Listado de proyectos actualmente en ejecución con acceso directo al análisis de fases, etapas, gastos e incidencias.",
  legalBottleneck:
    "Casos que bloquean el cierre y cobro: proyectos en proceso legal e incidencias abiertas. El semáforo indica la prioridad de atención.",
  criticalIncidents:
    "Incidencias abiertas que requieren decisión del gerente, especialmente las en revisión o recién enviadas. Impactan costos y plazos del proyecto.",
} as const;
