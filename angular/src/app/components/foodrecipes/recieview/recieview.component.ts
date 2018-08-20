import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-recieview',
  templateUrl: './recieview.component.html',
  styleUrls: ['./recieview.component.css']
})
export class RecieviewComponent implements OnInit {
  recipename: string;
  recipe:any;
  imgurl:String;
  myrecipe:any;
  constructor(private activatedRoute: ActivatedRoute,
              private authservice:AuthService,
              private ngFlashMessageService: NgFlashMessageService,
              private router:Router,
  ) {
    this.myrecipe={
      recipename:this.activatedRoute.snapshot.paramMap.get('recipename')
    }
   // console.log(this.myrecipe);
    
  
    this.authservice.getviewRecipe(this.myrecipe).subscribe(res=>{
      if(res.state){
        this.recipe = res.recipe;
        const myrecipe={
          "recipename":this.recipe.recipename,
          "ingredients":this.recipe.ingredients,
          "directions" :this.recipe.directions,
          "preptime" :this.recipe.preptime,
          "cooktime" :this.recipe.cooktime,
          "readytime" :this.recipe.readytime,
          "serves" :this.recipe.serves,
          "notes" :this.recipe.notes,
          "rate" :this.recipe.rate,
          "catagory" :this.recipe.catagory,
          "description" :this.recipe.description,
          "fileToUpload" :this.recipe.pic_url
          }
        
        //console.log("ds");
       /// console.log(this.recipe.recipename);
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

}
