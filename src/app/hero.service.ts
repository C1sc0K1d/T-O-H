import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  heroesUrl: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private log(message: string) {
    this.messageService.add(`ServiçosHeróicos: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);
 
      return of(result as T);
    };
  }

  constructor(private messageService: MessageService, private http: HttpClient) { 
    this.heroesUrl = 'http://localhost:8081/heroes';
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(_ => this.log('Todos heróis Encontrados')), catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`Herói de id ${id} encontrado`)), catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }

  getHeroesTop(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(_ => this.log('Os 5 heróis do topo')), catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(tap(_ => this.log(`Herói de id ${hero.id} atualizado`)), catchError(this.handleError<any>('updateHero')));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(tap((newHero: Hero) => this.log(`Herói de id ${newHero.id} criado`)), catchError(this.handleError<Hero>('addHero')));
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
  
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Herói de id ${id} deletado`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(x => x.length ? this.log(`Heróis com "${term}" encontrados`) : this.log(`Nenhum herói com "${term}" encontrado`)), catchError(this.handleError<Hero[]>('searchHeroes', [])));
  }
}
