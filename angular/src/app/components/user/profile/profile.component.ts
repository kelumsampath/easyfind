import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';


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
  editData:boolean;
  fullname:String;
  email:String;
  phoneno:Number;
  editimage:File;
  constructor(
    private authservice : AuthService,
    private ngFlashMessageService: NgFlashMessageService,
    private router:Router,
  ) { 
    this.editData=false;
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
  editform(){
    this.editData=true;
  }
  cancel(){
    this.editData=false;
  }
  saveform(){
    
    const newdata={
      fullname:this.fullname||this.user.fullname,
      email:this.email||this.user.email,
      phoneno:this.phoneno||this.user.phoneno
    }
    this.authservice.editUser(newdata).subscribe(res=>{
      if(res.state){
        this.editData=false;
      this.ngFlashMessageService.showFlashMessage({messages: [res.msg],dismissible: true,timeout: 4000,type: 'success'});
      
      this.router.navigate(['/..']);
      }
      else{
      //console.log(res.msg);
      this.ngFlashMessageService.showFlashMessage({messages: [res.msg],dismissible: false,timeout: 4000,type: 'danger'});
      ;
      }
    });
    
  }
  
  profpic(file:FileList){
    const image={
      editimage:file.item(0)
    }
    this.authservice.editimage(image).subscribe(res=>{
      if(res.state){
       
      this.ngFlashMessageService.showFlashMessage({messages: [res.msg],dismissible: true,timeout: 4000,type: 'success'});
      //console.log("ela");
      this.router.navigate(['/..']);
      }
      else{
      //console.log(res.msg);
      this.ngFlashMessageService.showFlashMessage({messages: [res.msg],dismissible: false,timeout: 4000,type: 'danger'});
      
      }
    });
  }

}
