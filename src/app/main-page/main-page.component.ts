import { Component } from '@angular/core';
import data from '../data/data1.json';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  
  userData: any;
  currentGraphData: any;
  currentSkill: any;

  constructor() {
    this.userData = data;
    this.currentGraphData = data.generalSkills.data;
    this.currentSkill = data.generalSkills;
  }

  giveMeTheCard(event: string) {
    console.log(event);
    switch (event) {
      case "profile":
        this.currentGraphData = data.generalSkills.data;
        this.currentSkill = data.generalSkills;
        break;
      case "frontend":
        this.currentGraphData = data.frontend.data;
        this.currentSkill = data.frontend;
        break;
      case "backend":
        this.currentGraphData = data.backend.data;
        this.currentSkill = data.backend;
        break;
      case "leadership":
        this.currentGraphData = data.leadership.data;
        this.currentSkill = data.leadership;
        break;
      case "design": 
        this.currentGraphData = data.design.data;
        this.currentSkill = data.design;
        break;
      default: 
        alert('Default case');
    }
  }
}
