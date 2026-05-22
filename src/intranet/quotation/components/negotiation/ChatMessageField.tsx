import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, type FC } from "react";

interface ChatMessageFieldProps {
  onSubmit: (message: string) => void;
}

export const ChatMessageField: FC<ChatMessageFieldProps> = ({ onSubmit }) => {
  const [draft, setDraft] = useState("");
  const submitHandler = (message: string) => {
    onSubmit(message);
    setDraft("");
  };
  const invalidDraft = draft.trim().length === 0;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler(draft);
      }}
      className="flex shrink-0 items-end gap-2 border-t border-gray-100 bg-white p-4"
    >
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Redacta tus observaciones"
        rows={2}
        className="min-h-[52px] resize-none rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-sky-400"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitHandler(draft);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={invalidDraft}
        className="h-11 w-11 shrink-0 rounded-xl bg-green-600 text-white hover:bg-green-700"
        aria-label="Enviar mensaje"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
