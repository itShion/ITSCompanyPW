import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RisorsaService } from '../app/services/RisorsaService';
import { signal } from '@angular/core';
import { Risorsa } from '../models/Risorsa';
import { AuthService } from '../app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { PrenotazioneDTO } from '../models/Prenotazione';
import { PrenotaService } from '../app/services/prenota-service';

@Component({
  selector: 'app-prenota',
  imports: [FormsModule],
  templateUrl: './prenota.html',
  styleUrls: ['./prenota.css'],
})
export class Prenota {
  private risorsaService = inject(RisorsaService);
  private prenotaService = inject(PrenotaService);
  private route = inject(ActivatedRoute);

  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();

  risorsa = signal<Risorsa | null>(null);

  dataInizio : string = "";
  dataFine : string = "";

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRisorsa(id);
  }

  loadRisorsa(id: number) {
    this.risorsaService.getRisorsa(id).subscribe({
      next: (data) => this.risorsa.set(data), 
      error: (err) => console.error('Errore:', err),
    });
  }

prenota() {
    const risorsaVal = this.risorsa();
    if (!risorsaVal || !this.dataInizio || !this.dataFine) {
      console.error('Dati mancanti');
      return;
    }

    const dto: PrenotazioneDTO = {
      risorsa: risorsaVal.id,
      data_inizio: this.dataInizio,
      data_fine: this.dataFine,
      stato: 'TRUE'
    };

    this.prenotaService.createPrenotazione(dto).subscribe({
      next: (res) => console.log('Prenotazione creata', res),
      error: (err) => console.error(err)
    });
  }
}
