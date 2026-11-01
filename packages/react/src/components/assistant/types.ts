export type AssistantThreadResultType = "conversation" | "metrics";

/** Resultado clicable bajo una respuesta del asistente. */
export interface AssistantThreadResult {
  type: AssistantThreadResultType;
  id?: string | number;
  title: string;
  subtitle?: string;
  url: string;
}

export interface AssistantThreadUserMessage {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantThreadBotMessage {
  id: string;
  role: "assistant";
  content: string;
  results: AssistantThreadResult[];
  scope?: "ok" | "unsupported";
  /** `true` si es el mensaje de error ("No he podido responder…"). */
  error?: boolean;
  /** Pregunta que originó este mensaje (para Reintentar). */
  question?: string;
  /** `true` una vez terminado el revelado por palabras (no se vuelve a animar). */
  revealed?: boolean;
}

export type AssistantThreadMessage = AssistantThreadUserMessage | AssistantThreadBotMessage;

/** Fila de la lista de chats guardados (el texto de fecha llega ya formateado). */
export interface AssistantChatListItem {
  id: string | number;
  title: string;
  /** Quién lo creó; sin él se usa `labels.unknownAuthor`. */
  author?: string | null;
  /** Fecha ya formateada ("hace 5 min"). */
  date?: string | null;
}
