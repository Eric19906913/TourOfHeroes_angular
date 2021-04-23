import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../Hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  public hero?:Hero;
  constructor(private route:ActivatedRoute, private heroService:HeroService, private location:Location) { }

  ngOnInit(): void {
    this.getHero();
  }

  public getHero():void{
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero)
  }
  public goBack():void{
    this.location.back();
  }
  public save():void{
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack()); //subscribe generates an action after an obsvervable is called
  }
}
