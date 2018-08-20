import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recieview',
  templateUrl: './recieview.component.html',
  styleUrls: ['./recieview.component.css']
})
export class RecieviewComponent implements OnInit {
  public id: string;
  constructor(private activatedRoute: ActivatedRoute) {
    
   }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

}
