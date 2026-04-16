import { Layout } from "@/shared/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
    AlertTriangle,
    ArrowRight,
    Banknote,
    ClipboardCheck,
    Clock3,
    FileText,
    Package,
    TrendingUp,
    Users,
} from "lucide-react";

const kpiCards = [
    {
        title: "Solicitudes Pendientes",
        value: "27",
        detail: "+8% vs. semana anterior",
        icon: FileText,
        tone: "text-amber-700",
    },
    {
        title: "Cotizaciones Aprobadas",
        value: "64",
        detail: "+12% en los ultimos 30 dias",
        icon: ClipboardCheck,
        tone: "text-emerald-700",
    },
    {
        title: "Clientes Activos",
        value: "142",
        detail: "16 clientes nuevos este mes",
        icon: Users,
        tone: "text-sky-700",
    },
    {
        title: "Facturacion Estimada",
        value: "S/ 184,200",
        detail: "Proyeccion mensual",
        icon: Banknote,
        tone: "text-violet-700",
    },
] as const;

const operationalStatus = [
    { label: "Inventario Critico", value: 18, goal: 25, risk: "alta" },
    { label: "Ordenes en Preparacion", value: 39, goal: 45, risk: "media" },
    { label: "Entregas del Dia", value: 21, goal: 24, risk: "baja" },
] as const;

const recentActivity = [
    {
        title: "Aprobacion de cotizacion #COT-1024",
        time: "Hace 14 min",
        owner: "Jefatura Comercial",
        impact: "Alta",
    },
    {
        title: "Solicitud #SOL-845 en espera de validacion",
        time: "Hace 32 min",
        owner: "Equipo de Ventas",
        impact: "Media",
    },
    {
        title: "Alerta de stock minimo en repuestos",
        time: "Hace 1 h",
        owner: "Area Inventario",
        impact: "Alta",
    },
    {
        title: "Nuevo cliente corporativo registrado",
        time: "Hace 2 h",
        owner: "Atencion al Cliente",
        impact: "Baja",
    },
] as const;

export default function DashboardClientPage() {
    const today = new Date().toLocaleDateString("es-PE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Layout title="Dashboard" className="flex flex-1 flex-col gap-5 p-4 pt-2">
            <section className="rounded-xl border bg-linear-to-r from-zinc-50 via-white to-lime-50 p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <Badge variant="secondary" className="w-fit px-3 py-1 text-[11px] uppercase tracking-[0.08em]">
                            Centro de control
                        </Badge>
                        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
                            Panel de Administracion
                        </h1>
                        <p className="max-w-2xl text-sm text-zinc-600 md:text-base">
                            Supervisa operaciones, prioridades comerciales y estado del flujo de solicitudes en tiempo real.
                        </p>
                    </div>

                    <div className="space-y-1 text-left lg:text-right">
                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">Hoy</p>
                        <p className="text-sm font-medium text-zinc-800">{today}</p>
                        <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Rendimiento operativo estable
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map(({ title, value, detail, icon: Icon, tone }) => (
                    <Card key={title} className="border shadow-none">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs uppercase tracking-[0.06em] text-zinc-500">
                                {title}
                            </CardDescription>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-2xl font-semibold text-zinc-900">{value}</CardTitle>
                                <div className="rounded-lg border bg-white p-2">
                                    <Icon className={`h-4 w-4 ${tone}`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-600">{detail}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="border shadow-none xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Estado Operativo</CardTitle>
                        <CardDescription>Seguimiento de indicadores criticos del dia.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {operationalStatus.map(({ label, value, goal, risk }) => {
                            const progress = Math.min((value / goal) * 100, 100);

                            return (
                                <div key={label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-zinc-800">{label}</span>
                                        <span className="text-zinc-600">
                                            {value} / {goal}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-zinc-100">
                                        <div
                                            className="h-2 rounded-full bg-zinc-800 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        {risk === "alta" ? (
                                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                                        ) : (
                                            <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                                        )}
                                        Riesgo {risk}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card className="border shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Acciones Rapidas</CardTitle>
                        <CardDescription>Atajos para tareas frecuentes de administracion.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-between" variant="outline">
                            Revisar solicitudes pendientes
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between" variant="outline">
                            Gestionar inventario critico
                            <Package className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between">
                            Crear anuncio interno
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <section>
                <Card className="border shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                        <CardDescription>Eventos clave reportados por los distintos equipos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity.map(({ title, time, owner, impact }, index) => (
                            <div key={title}>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-zinc-900">{title}</p>
                                        <p className="text-xs text-zinc-600">{owner}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={impact === "Alta" ? "destructive" : "secondary"}>{impact}</Badge>
                                        <span className="text-xs text-zinc-500">{time}</span>
                                    </div>
                                </div>

                                {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </Layout>
    );
}