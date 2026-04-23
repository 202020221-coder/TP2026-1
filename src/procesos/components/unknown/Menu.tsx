import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FileText, Users, Package, TrendingUp } from "lucide-react";
const dashboardItems = [
  {
    title: "Cotizaciones",
    description: "Crear y gestionar cotizaciones",
    href: "/procesos/cotizaciones",
    icon: FileText,
    color: "from-blue-600 to-blue-700",
    count: 0,
  },
  {
    title: "Clientes",
    description: "Administrar empresas y clientes",
    href: "/procesos/clientes",
    icon: Users,
    color: "from-indigo-600 to-indigo-700",
    count: 0,
  },
  {
    title: "Proyectos",
    description: "Gestionar proyectos e inventario",
    href: "/procesos/proyectos",
    icon: Package,
    color: "from-purple-600 to-purple-700",
    count: 0,
  },
  {
    title: "Análisis",
    description: "Ver reportes y estadísticas",
    href: "/procesos/analisis",
    icon: TrendingUp,
    color: "from-green-600 to-green-700",
    count: 0,
  },
];

export function Menu() {
  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Sistema de Gestión
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Administra cotizaciones, clientes y proyectos de forma eficiente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pl-3">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href}>
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div
                    className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center mb-2`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {item.count}
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </>
  );
}
