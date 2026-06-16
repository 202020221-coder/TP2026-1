import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type { FC } from "react";

interface ChatHeaderProps {
  contactName: string;
  contactRole: UserRole;
  onCloseChat: () => void;
  unreadCount?: number;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const ChatHeader: FC<ChatHeaderProps> = ({
  contactName,
  contactRole,
  onCloseChat,
  unreadCount = 0,
}) => {
  let roleLabel: string;
  switch (contactRole) {
    case RolesRecord.client:
      roleLabel = "Cliente";
      break;
    case RolesRecord.projectAdmin:
      roleLabel = "Administrador de Proyectos";
      break;
    default:
      throw new Error("Error: Usuario no permitido ingreso al chat");
  }
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-primary px-4 py-3 shadow-sm">
      <Avatar size="lg" className="border-2 border-white/30 bg-white/15">
        <AvatarFallback className="bg-white/20 text-sm font-bold text-white">
          {getInitials(contactName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-tight text-white drop-shadow-sm">
          {contactName}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-[12px] font-medium tracking-wide text-white/65">
            {roleLabel}
          </p>
          {unreadCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              {unreadCount} nuevo{unreadCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-full text-white/60 hover:bg-white/15 hover:text-white"
        onClick={onCloseChat}
        aria-label="Cerrar chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </header>
  );
};
