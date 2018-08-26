import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any;
  myname:String;
  recipe:any;
  imgurl:String;
  constructor(
    private authservice : AuthService,
    private ngFlashMessageService: NgFlashMessageService,
  ) { 
    this.authservice.getprofile().subscribe(res=>{
     if(res.state){
      this.user = res.loggeduser;
      this.myname=this.user.username;
      //console.log(this.user);
     }else{
      this.ngFlashMessageService.showFlashMessage({messages: ['Server Error!'],dismissible: true,timeout: 4000,type: 'danger'});
     }
    });
    const myusername={
      "username":this.myname
    };
    this.authservice.getuserrecipes(myusername).subscribe(res=>{
      if(res.state){
        //console.log(res.recipe);
        this.recipe = res.recipe;
        this.imgurl = res.pic_url;
       }else{
        this.ngFlashMessageService.showFlashMessage({messages: ['Server Error!'],dismissible: true,timeout: 4000,type: 'danger'});
       }
    })
  }

  ngOnInit() {
   
  }

}
