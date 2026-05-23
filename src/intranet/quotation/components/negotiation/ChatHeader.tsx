import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { UserRole } from "@/security/session/interfaces/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type { FC } from "react";

interface ChatHeaderProps {
  contactName: string;
  contactRole: UserRole;
  onCloseChat: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  contactName,
  contactRole,
  onCloseChat,
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
    <header className="flex shrink-0 items-center gap-3 border-b border-primary/10 bg-primary/5 px-4 py-3">
      <Avatar size="lg" className="border border-primary/20 bg-white">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="grayscale"
        />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {contactName}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {contactName}
        </p>
        <p className="text-xs text-gray-500">{roleLabel}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-gray-500 hover:text-gray-800"
        onClick={onCloseChat}
        aria-label="Cerrar chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </header>
  );
};
