import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:any;
  constructor(
    private authservice : AuthService,
    private ngFlashMessageService: NgFlashMessageService,
  ) { }

  ngOnInit() {
    this.authservice.getprofile().subscribe(res=>{
      this.user = res;
      //console.log(this.user);
    })
  }

}
