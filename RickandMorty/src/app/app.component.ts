import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterComponent } from './character/character.component'; // Asegúrate de ajustar la ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CharacterComponent,], // Agregar HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rick and Morty';
}
