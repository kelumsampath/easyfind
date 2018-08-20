import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../service/auth.service";
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allrecipe',
  templateUrl: './allrecipe.component.html',
  styleUrls: ['./allrecipe.component.css']
})
export class AllrecipeComponent implements OnInit {
  recipe:any;
  heroes:any;
  imgurl:String;
  constructor(
    private authservice:AuthService,
    private ngFlashMessageService: NgFlashMessageService,
    private router:Router,
  ) {
    this.authservice.getAllRecipe().subscribe(res=>{
      if(res.state){
        this.heroes = res.recipe;
        this.imgurl = res.pic_url;
        //console.log("ds");
       // console.log(res.recipe);
        //this.recipe=res.recipe;
        //console.log(this.recipe);
      }
        else{
          this.ngFlashMessageService.showFlashMessage({messages: ["SERVER ERROR OCCUERED!"],dismissible: true,timeout: 4000,type: 'danger'});
        }
    });
   }

  ngOnInit() {
  
  }
 // title = 'Tour of Heroes';
 // heroes = ['Windstorm', 'Bombasto', 'Magneta'];
 // myHero = this.heroes[0];
 
}
