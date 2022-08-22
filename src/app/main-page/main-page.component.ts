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
  color: string = 'steelblue';

  constructor() {
    this.userData = data;
    this.currentGraphData = data.generalSkills.data;
    this.currentSkill = this.calculateGeneralSkills();
    this.color = this.getMainColor(data.generalSkills.data[0]);
  }

  giveMeTheCard(event: string) {
    console.log(event);
    switch (event) {
      case "profile":
        this.currentGraphData = this.calculateGeneralSkills().data;
        this.currentSkill = this.calculateGeneralSkills();
        this.color = this.getMainColor(data.generalSkills.data[0]);
        break;
      case "frontend":
        this.currentGraphData = data.frontend.data;
        this.currentSkill = data.frontend;
        this.color = data.frontend.mainColor;
        break;
      case "backend":
        this.currentGraphData = data.backend.data;
        this.currentSkill = data.backend;
        this.color = data.backend.mainColor;
        break;
      case "leadership":
        this.currentGraphData = data.leadership.data;
        this.currentSkill = data.leadership;
        this.color = data.leadership.mainColor;
        break;
      case "design": 
        this.currentGraphData = data.design.data;
        this.currentSkill = data.design;
        this.color = data.design.mainColor;
        break;
      default: 
        alert('Default case');
        break;
    }
  }

  getMainColor(dataSet: Array<any>): string {
    const aux = Math.max(...dataSet.map(o => o.value));
    const index = dataSet.map(o => o.value).indexOf(aux);
    switch (dataSet[index].axis) {
      case "Frontend":
        this.currentSkill.class = data.frontend.class; 
        return data.frontend.mainColor;
        break;
      case "Backend":
        this.currentSkill.class = data.backend.class;
        return data.backend.mainColor;
        break;
      case "Liderazgo":
        this.currentSkill.class = data.leadership.class;
        return data.leadership.mainColor;
        break;
      case "Diseño":
        this.currentSkill.class = data.design.class;
        return data.design.mainColor;
        break;
      default:
        alert('Skill and Color Not Found');
        return 'black';
        break;
    }
  }

  calculateGeneralSkills(): any {
    let generalSkills = data.generalSkills;
    generalSkills.data[0][0].value = this.calculateProm(data.frontend.data[0].map(o => o.value));
    generalSkills.data[0][1].value = this.calculateProm(data.backend.data[0].map(o => o.value));
    generalSkills.data[0][2].value = this.calculateProm(data.leadership.data[0].map(o => o.value));
    generalSkills.data[0][3].value = this.calculateProm(data.design.data[0].map(o => o.value));
    return generalSkills;
  }

  calculateProm(data: any): number {
    let sum: number = 0;
    let prom: number = 0;
    data.forEach((v: any) => sum = sum + v);
    prom = sum / data.length; 
    return prom;
  } 
}
