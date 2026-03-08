import { Risorsa } from "./Risorsa";

export interface Partecipante {
    id: number;
    username: string;
    stato: 'INVITATO' | 'ACCETTATO' | 'RIFIUTATO';
}

export interface Prenotazione {
    id: number;
    risorsa: Risorsa;
    utente: number;
    utente_nome: string;
    data_inizio: string;
    data_fine: string;
    stato: 'PENDING' | 'CONFERMATA' | 'ANNULLATA';
    stato_display: string;
    motivo?: string;
    partecipanti: Partecipante[];   // aggiunto
    created_at: string;
    updated_at: string;
}

export interface PrenotazioneDTO {
    risorsa_id: number;
    data_inizio: string;
    data_fine: string;
    motivo?: string;
    partecipanti_ids?: number[];    // aggiunto, opzionale
}