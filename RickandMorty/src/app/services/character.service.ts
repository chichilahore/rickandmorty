import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Character } from '../interfaces/character';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private http = inject(HttpClient); 

  getCharacters(filters: { name?: string; status?: string; page?: number }): Observable<ApiResponse<Character[]>> {
    let params = new URLSearchParams();
    
    if (filters.name) {
      params.set('name', filters.name);
    }
    if (filters.status) {
      params.set('status', filters.status);
    }
    if (filters.page) {
      params.set('page', filters.page.toString());
    }

    return this.http.get<ApiResponse<Character[]>>(`${this.apiUrl}?${params.toString()}`);
  }

}


