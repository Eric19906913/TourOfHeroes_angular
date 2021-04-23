import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './Hero';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http:HttpClient
    ) { }

  private heroesUrl:string = `api/heroes`;
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private log(message:string){
    this.messageService.add(`HeroService: ${message}`);
  }
  //get all heroes
  public getHeroes() :Observable<Hero[]> {
    /*Old implementation with static data*/ 
    //const heroes = of(HEROES);
    //this.messageService.add('HeroService: fetched heroes');
    
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')), //the tap function look at the values but it doesnt change them
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }
  //get hero by id
  public getHero(id:number): Observable<Hero>{
    /*Old implementation */
    //const hero = HEROES.find(h => h.id === id) as Hero;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    //this.log(`fetched heroe id=${id}`);
    //return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  public updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(   //http.put takes 3 params the url, the data and options
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updated hero id=${hero.id}`))
    )
  }

  public addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero:Hero) => this.log(`added a hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))    
    )
  }
  public deleteHero(id:number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>(`deleteHero id=${id}`))
    )
  }

  public searchHeroes(term: string) : Observable<Hero[]>{
    if(!term.trim()){
      return of([]); //returns an empty observable of an array
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) : 
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>(`search heroes`,[]))
    );
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error:any): Observable<T> => {
      //Send the error to the console
      console.error(error);
      //transform the error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      //let the app keep running returning empty result
      return of(result as T);
    } 
  }
}

