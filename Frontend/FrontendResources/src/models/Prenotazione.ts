export interface Prenotazione {
    id: number;
    data_inizio: Date;
    data_fine: Date;
    stato: string;
    created_at: Date;
    utente_id: number;
    risorsa: number;
}

export interface PrenotazioneDTO{
    data_inizio: string;
    data_fine: string;
    stato: 'TRUE' | 'FALSE';
    risorsa: number;
}