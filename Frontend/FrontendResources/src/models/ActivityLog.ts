export interface ActivityLog {
    id: number;
    azione: 'CREATA' | 'CONFERMATA' | 'ANNULLATA' | 'RIFIUTATA' | 'PARTECIPANTE_RIFIUTATO' | 'PARTECIPANTE_ACCETTATO';
    utente_nome: string;
    descrizione: string;
    risorsa_nome: string;
    data_inizio: string;
    data_fine: string;
    created_at: string;
}