export interface Postazione{
    id:string,
    numeroServizio:string,
    tipoServizio:string,
    disponibile?:boolean,
    selected?:boolean,
    orario?:boolean,
    tipoOriginale?: string,
    prenotata?:boolean,
    favourite?:boolean,
    inPrenotazione?: boolean;

    

}