import { Component,  AfterViewInit,ElementRef} from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule],
  templateUrl: './prenotazioni.html',
  styleUrl: './prenotazioni.css'
})
export class Prenotazioni implements AfterViewInit {
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    const rects = Array.from(
  this.elRef.nativeElement.querySelectorAll('rect[pointer-events="all"]')
) as SVGRectElement[];

const postazione = rects.filter(rect =>
  rect.getAttribute('width') === '31.11' &&
  rect.getAttribute('height') === '16.05'
);


  postazione.forEach((rect) => {
  rect.addEventListener('click', (event) => {
  event.stopPropagation();
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '2px solid black';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';

        const message = document.createElement('p');
        message.textContent = 'Vuoi prenotare questa postazione?';

        const btn = document.createElement('button');
        btn.textContent = 'Prenota';
        btn.style.marginTop = '10px';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';

        popup.appendChild(message);
        popup.appendChild(btn);
        document.body.appendChild(popup);

        // Prenota e colora il rect
        btn.addEventListener('click', () => {
          rect.style.fill = 'red';
          document.body.removeChild(popup);
        });

        // Chiudi popup cliccando fuori
        popup.addEventListener('click', (e) => e.stopPropagation());
        const closeHandler = () => {
          if (document.body.contains(popup)) {
            document.body.removeChild(popup);
          }
          document.removeEventListener('click', closeHandler);
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
      });
    });




  const ellipse = Array.from(
  this.elRef.nativeElement.querySelectorAll('ellipse[pointer-events="all"]')
) as SVGEllipseElement[];

const riunioni = ellipse.filter(e =>
  (
    e.getAttribute('rx') === '53.375' &&
    e.getAttribute('ry') === '21.428571428571427'
  ) ||
  (
    e.getAttribute('rx') === '24' &&
    e.getAttribute('ry') === '17.857142857142858'
  )
);



  riunioni.forEach((ellipse) => {
  ellipse.addEventListener('click', (event) => {
  event.stopPropagation();
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '2px solid black';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';

        const message = document.createElement('p');
        message.textContent = 'Vuoi prenotare questa sala riunioni?';

        const btn = document.createElement('button');
        btn.textContent = 'Prenota';
        btn.style.marginTop = '10px';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';

        popup.appendChild(message);
        popup.appendChild(btn);
        document.body.appendChild(popup);

        // Prenota e colora il rect
        btn.addEventListener('click', () => {
          ellipse.style.fill = 'pink';
          document.body.removeChild(popup);
        });

        // Chiudi popup cliccando fuori
        popup.addEventListener('click', (e) => e.stopPropagation());
        const closeHandler = () => {
          if (document.body.contains(popup)) {
            document.body.removeChild(popup);
          }
          document.removeEventListener('click', closeHandler);
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
      });
    });

     const rects2 = Array.from(
      this.elRef.nativeElement.querySelectorAll('rect[pointer-events="all"]')
    ) as SVGRectElement[];

    // FILTRA SOLO IL RECT DELLA MENSA
    const mensa = rects2.find(rect =>
      rect.getAttribute('x') === '400' &&
      rect.getAttribute('y') === '380' &&
      rect.getAttribute('width') === '240' &&
      rect.getAttribute('height') === '130'
    );

    if (!mensa) return;

    mensa.addEventListener('click', (event) => {
      event.stopPropagation();

      // POPUP
      const popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.backgroundColor = 'white';
      popup.style.padding = '24px';
      popup.style.border = '2px solid black';
      popup.style.zIndex = '1000';
      popup.style.textAlign = 'center';
      popup.style.minWidth = '300px';

      const title = document.createElement('h3');
      title.textContent = 'Menu mensa del mese';

      const btn = document.createElement('button');
      btn.textContent = 'Apri menu PDF';
      btn.style.marginTop = '16px';
      btn.style.padding = '8px 16px';
      btn.style.cursor = 'pointer';

      popup.appendChild(title);
      popup.appendChild(btn);
      document.body.appendChild(popup);

      // APRI PDF
      btn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = '/mensa.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
});


      // CHIUSURA cliccando fuori
      popup.addEventListener('click', e => e.stopPropagation());

      const closeHandler = () => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
        document.removeEventListener('click', closeHandler);
      };

      setTimeout(() => document.addEventListener('click', closeHandler), 0);
    });
  }

}

