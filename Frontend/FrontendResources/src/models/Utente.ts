export interface Utente {
  id: number;
  username: string;
  ruolo: string;
  email?: string;
  telefono: string;
  user_id: number;
  is_active?: boolean;
  last_login?: string;
}
export interface LoginDTO {
  username: string;
  password: string;
}
export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  telefono: string;
  first_name?: string;
  last_name?: string;
  repeatPassword?: string;
}
export interface DjangoUserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  ruolo: string;
  telefono: string;
  utente_id: number;
}
export interface DjangoAuthResponse {
  access: string;
  refresh: string;
  user: DjangoUserResponse;
}

export interface CurrentUser{
  id: number;
  username: string;
  ruolo : string;
  telefono: string;
  user_id: number;
}

export interface NuovoUtenteDTO {
  username: string;
  email?: string;
  password?: string;
  ruolo: string;
  telefono?: string;
 }
