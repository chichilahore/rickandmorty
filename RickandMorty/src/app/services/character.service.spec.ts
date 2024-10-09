import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { Character } from '../interfaces/character'; // Ajustar la ruta según tu proyecto
import { ApiResponse } from '../interfaces/api-response'; // Ajustar la ruta según tu proyecto

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [CharacterService]
    });
    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no hay solicitudes pendientes
  });

  it('should retrieve characters', () => {
    const mockResponse: ApiResponse<Character[]> = {
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null
      },
      results: [
        { name: 'Rick Sanchez', status: 'Alive', image: 'mockImage.jpg' } as Character
      ]
    };

    service.getCharacters({ name: 'Rick' }).subscribe((res) => {
      expect(res.results.length).toBe(1);
      expect(res.results[0].name).toBe('Rick Sanchez');
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?name=Rick');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); 
  });

  it('should handle error response', () => {
    service.getCharacters({ name: 'Rick' }).subscribe({
      next: () => fail('should have failed with a 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?name=Rick');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
