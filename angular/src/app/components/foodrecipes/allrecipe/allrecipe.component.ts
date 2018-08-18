import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-allrecipe',
  templateUrl: './allrecipe.component.html',
  styleUrls: ['./allrecipe.component.css']
})
export class AllrecipeComponent implements OnInit {

  constructor() {
    const accountList={
      Amount:100,
    }
   }

  ngOnInit() {
   
  }
  title = 'Tour of Heroes';
  heroes = ['Windstorm', 'Bombasto', 'Magneta'];
  myHero = this.heroes[0];

}
