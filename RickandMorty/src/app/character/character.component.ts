import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../services/character.service'; 
import { Character } from '../interfaces/character';
import { ApiResponse } from '../interfaces/api-response';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs'; 

@Component({
  selector: 'app-character',
  standalone: true, 
  imports: [FormsModule, NgIf, NgFor],  
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  characters: Character[] = [];
  searchText: string = '';
  statusFilter: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private characterService = inject(CharacterService);

  ngOnInit(): void {
    this.getAllCharacters();  
  }

  getAllCharacters(): void {
    this.isLoading = true;
    this.characters = [];
  
    const filters: { name?: string; status?: string; page?: number } = {
      status: this.statusFilter,
      page: 1,
    };
  
    if (this.searchText.trim().length > 0) {
      filters.name = this.searchText;
    } 
  
    this.characterService.getCharacters(filters).subscribe({
      next: (response: ApiResponse<Character[]>) => {
        if (response) {
          this.characters = response.results;
          const totalPages = response.info.pages;
          
          if (totalPages > 1) {
            this.loadRemainingPages(totalPages, filters);
          } else {
            this.isLoading = false;
          }
        } else {
          this.errorMessage = 'No se pudieron cargar los personajes'; 
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Error al cargar personajes'; 
        this.isLoading = false;
      }
    });
  }

  loadRemainingPages(totalPages: number, filters: { name?: string; status?: string; page?: number }): void {
    const requests = [];
    
    for (let page = 2; page <= totalPages; page++) {
      requests.push(this.characterService.getCharacters({ ...filters, page }));
    }
  
    forkJoin(requests).subscribe({
      next: (responses: ApiResponse<Character[]>[]) => {
        responses.forEach(response => {
          if (response) {
            this.characters = [...this.characters, ...response.results];
          }
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar personajes'; 
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.getAllCharacters();  
  }
}
