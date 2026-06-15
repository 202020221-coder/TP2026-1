import type { FC } from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { Quotation } from "../../interfaces/quotation";
import { useQuotationChatStatus } from "../../hooks/useQuotationChatStatus";
import {
  getQuotationMessageStateBadgeClass,
  getQuotationMessageStateTooltipClass,
  getQuotationMessageStateTooltipLabel,
  QuotationMessageStateLabels,
} from "../../enum/quotation-message-state.record";

type QuotationChatStatusCellProps = {
  quotation: Pick<Quotation, "ID" | "mensajes" | "chat">;
  canNegotiate: boolean;
  onOpenChat: () => void;
};

export const QuotationChatStatusCell: FC<QuotationChatStatusCellProps> = ({
  quotation,
  canNegotiate,
  onOpenChat,
}) => {
  const { messageState, isLoading } = useQuotationChatStatus(
    quotation.ID,
    quotation,
  );

  const messageLabel = QuotationMessageStateLabels[messageState];
  const messageBadgeClass = getQuotationMessageStateBadgeClass(messageState);
  const messageTooltipClass = getQuotationMessageStateTooltipClass(messageState);
  const messageTooltipLabel = getQuotationMessageStateTooltipLabel(messageState);

  if (isLoading) {
    return (
      <Skeleton className="mx-auto h-7 w-36 rounded-full bg-gray-50" />
    );
  }

  if (!canNegotiate) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "mx-auto max-w-[200px] whitespace-normal text-center text-xs font-medium leading-snug",
          messageBadgeClass,
        )}
      >
        {messageLabel}
      </Badge>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onOpenChat}
          className={cn(
            "mx-auto inline-flex max-w-[200px] items-center justify-center rounded-full border px-3 py-1 text-xs font-medium leading-snug transition-colors cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2",
            messageBadgeClass,
          )}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          {messageLabel}
        </button>
      </TooltipTrigger>
      <TooltipContent
        className={cn(
          "bg-white border-[1.5px] font-normal text-center",
          messageTooltipClass,
        )}
        align="center"
      >
        {messageTooltipLabel}
      </TooltipContent>
    </Tooltip>
  );
};
