import { TipoRisorsa } from "./TipoRisorsa";

export type StatoRisorsa = 'ATTIVA' | 'MANUTENZIONE' | 'DISATTIVA';

export interface Risorsa {
    id: number;
    nome: string;
    descrizione: string;
    capacita: number;
    tipo: TipoRisorsa;
    orario_apertura: string;
    orario_chiusura: string;
    lunedi: boolean;
    martedi: boolean;
    mercoledi: boolean;
    giovedi: boolean;
    venerdi: boolean;
    sabato: boolean;
    domenica: boolean;
    stato: StatoRisorsa;
    stato_display: string;
}

export interface RisorsaCreate {
    nome: string;
    descrizione: string;
    capacita: number;
    tipo_id: number;
    orario_apertura: string;
    orario_chiusura: string;
    lunedi: boolean;
    martedi: boolean;
    mercoledi: boolean;
    giovedi: boolean;
    venerdi: boolean;
    sabato: boolean;
    domenica: boolean;
}