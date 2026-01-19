export interface Prenotazione {
    id: number;
    data_inizio: Date;
    data_fine: Date;
    stato: string;
    created_at: Date;
    utente_id: number;
    risorsa_id: number;
}