import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-foodrecipe',
  templateUrl: './foodrecipe.component.html',
  styleUrls: ['./foodrecipe.component.css']
})
export class FoodrecipeComponent implements OnInit {

  constructor() {
    
   }

  ngOnInit() {
  }
  imageSources = ["../../../assets/images/cover.jpg",
  "http://bestcoverpix.com/wp-content/uploads/2014/01/clear-water-island-Nature-Facebook-covers.jpg",
  "../../../assets/images/cover.jpg"];

}
