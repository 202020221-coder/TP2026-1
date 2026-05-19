import sleep from "@/shared/lib/sleep";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { NegotiationAuthorRole, NegotiationMessage } from "../interfaces/negotiation-message";

const storageKey = (quotationId: number) =>
  `quotation-negotiation-chat:${quotationId}`;

const seedMessages = (quotationId: number): NegotiationMessage[] => [
  {
    id: `${quotationId}-seed-1`,
    quotationId,
    authorRole: RolesRecord.projectAdmin,
    authorName: "Asistente de Proyectos",
    content:
      "Hola, revisé su cotización. ¿Tiene alguna observación sobre los productos o el costo de recojo?",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const readStored = (quotationId: number): NegotiationMessage[] => {
  const raw = sessionStorage.getItem(storageKey(quotationId));
  if (!raw) {
    const seeded = seedMessages(quotationId);
    sessionStorage.setItem(storageKey(quotationId), JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as NegotiationMessage[];
};

const writeStored = (
  quotationId: number,
  messages: NegotiationMessage[],
): void => {
  sessionStorage.setItem(storageKey(quotationId), JSON.stringify(messages));
};

export const getNegotiationMessages = async (
  quotationId: number,
): Promise<NegotiationMessage[]> => {
  await sleep(600);
  return readStored(quotationId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const sendNegotiationMessage = async (payload: {
  quotationId: number;
  authorRole: NegotiationAuthorRole;
  authorName: string;
  content: string;
}): Promise<NegotiationMessage> => {
  await sleep(400);
  const message: NegotiationMessage = {
    id: crypto.randomUUID(),
    quotationId: payload.quotationId,
    authorRole: payload.authorRole,
    authorName: payload.authorName,
    content: payload.content.trim(),
    createdAt: new Date().toISOString(),
  };
  const messages = [...readStored(payload.quotationId), message];
  writeStored(payload.quotationId, messages);
  return message;
};
