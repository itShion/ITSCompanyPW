export interface NotificaResponse {
  count: number;
  results: Notifica[];
}

export interface Notifica {
  id: number;
  titolo: string;
  messaggio: string;
  letta: boolean;
  created_at: string;
}