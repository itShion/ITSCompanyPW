import { TipoRisorsa } from './TipoRisorsa';

export interface Risorsa {
  id: number;
  nome: string;
  descrizione: string;
  is_available: boolean;
  capacita: number;
  tipo : TipoRisorsa;
}


