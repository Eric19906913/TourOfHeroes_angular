import { Component, OnInit } from '@angular/core';
import { Hero } from '../Hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  public heroes:Hero[];
  // public selectedHero?:Hero; //can be null
  constructor(private heroService:HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  public getHeroes():void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
  public add(name:string):void{
    name = name.trim();
    if(!name){ return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  public delete(hero:Hero):void{
    this.heroes = this.heroes.filter(h => h !==hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

  // public onSelect(hero:Hero) : void{
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }
}
