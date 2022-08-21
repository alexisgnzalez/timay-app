import { Component } from '@angular/core';
import data from '../data/data1.json';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  // userData: any = data;
  constructor() {
    console.log(data);
  }
}
