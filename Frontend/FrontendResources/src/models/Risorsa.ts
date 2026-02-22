import { TipoRisorsa } from "./TipoRisorsa";

export interface Risorsa {
    id: number;
    nome: string;
    descrizione: string;
    is_available: boolean;
    capacita: number;
    tipo: TipoRisorsa;  // Oggetto completo, non solo ID
    orario_apertura: string;  // "08:00:00"
    orario_chiusura: string;  // "18:00:00"
    lunedi: boolean;
    martedi: boolean;
    mercoledi: boolean;
    giovedi: boolean;
    venerdi: boolean;
    sabato: boolean;
    domenica: boolean;
    attiva: boolean;
    created_at: string;
}

export interface RisorsaCreate {
  nome: string;
  descrizione: string;
  capacita: number;
  tipo: number;  // Solo ID!
  orario_apertura: string;
  orario_chiusura: string;
  lunedi: boolean;
  martedi: boolean;
  mercoledi: boolean;
  giovedi: boolean;
  venerdi: boolean;
  sabato: boolean;
  domenica: boolean;
  attiva: boolean;
}
