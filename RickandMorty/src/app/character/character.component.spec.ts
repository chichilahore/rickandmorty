import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterComponent } from './character.component';
import { CharacterService } from '../services/character.service';
import { of } from 'rxjs';
import { Character } from '../interfaces/character';
import { ApiResponse } from '../interfaces/api-response';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;

  beforeEach(async () => {
    characterService = jasmine.createSpyObj('CharacterService', ['getCharacters']);

    await TestBed.configureTestingModule({
      declarations: [CharacterComponent],
      providers: [
        { provide: CharacterService, useValue: characterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch characters on initialization', () => {
    const mockResponse: ApiResponse<Character[]> = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human', 
        type: '',
        gender: 'Male',
        image: 'mockImage.jpg',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        episode: [],
        created: '2017-11-04T18:48:46.250Z'
      }]
    };

    characterService.getCharacters.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(characterService.getCharacters).toHaveBeenCalled();
  });
});
