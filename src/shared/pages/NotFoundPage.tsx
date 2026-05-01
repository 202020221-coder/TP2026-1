import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Ghost, Radar, Bug, Construction, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";

const messages = [
  "¿404? Aprende a escribir bien la URL, campeón 🧐",
  "Tu GPS web se fue por un ceviche 🧭",
  "Esta página existe... pero en otra vida :c",
  "Si tenías fe en esta ruta, ya no la tienes 🙃",
  "No sé qué buscabas, pero aquí no está 😅",
  "Ni Google sabe dónde está esta página 🤷‍♂️",
  "Error 404: Tal vez si le rezas a StackOverflow... 🛐",
  "No estás mal tú, está mal el universo 🪐",
  "¿Intentaste apagar y prender la web? 🔌",
  "Volvé al inicio antes de que nos pongamos a llorar 😢",
];

const icons = [Ghost, Radar, Bug, Construction, AlertTriangle];

export const NotFoundPage = () => {
  // const user = useAuthStore((state) => state.user);

  const Message = useMemo(() => {
    const text = messages[Math.floor(Math.random() * messages.length)];
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return { text, Icon };
  }, []);

  const navigate = useNavigate();

  // if (!user) return <Navigate to="/extranet/login" replace />;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 animate-fade-in">
      <Message.Icon className="w-35 h-35 text-muted-foreground mb-4 animate-pulse" />

      <h1 className="text-5xl sm:text-7xl md:text-9xl font-extrabold text-primary">
        404
      </h1>
      <p className="font-mono text-base sm:text-lg mt-8 text-muted-foreground max-w-md ">
        {Message.text}
      </p>

      <Button
        onClick={() => navigate(-1)}
        className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 sm:px-6 sm:py-3 text-white shadow transition hover:scale-105 hover:bg-primary/90 text-xl sm:text-2xl font-mono"
      >
        Volver
      </Button>
    </div>
  );
};

export default NotFoundPage;
