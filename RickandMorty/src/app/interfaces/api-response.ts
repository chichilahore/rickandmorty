import { Info } from './info'; 

export interface ApiResponse<T> {
  info: Info;             
  results: T;           
}
