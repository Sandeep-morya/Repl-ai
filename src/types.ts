export type ChatType = "user" | "assistant";

export interface Chat {
	role: ChatType;
	content: string;
	timestamp: number;
}
