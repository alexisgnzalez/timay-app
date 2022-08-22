import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit {

  @Input() charData: any;
  @Input() currentSkill: any;
  @Input() color: string = 'steelblue';
  barClasses: any = {
    development: false,
    backend: false,
    leadership: false,
    design: false
  } 

  constructor() { }

  ngOnInit(): void {
    this.setBarClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setBarClasses();
  }

  setBarClasses() {
    this.barClasses = {
      development: this.currentSkill.class === 'development',
      backend: this.currentSkill.class === 'backend',
      leadership: this.currentSkill.class === 'leadership',
      design: this.currentSkill.class === 'design'
    }
  }

  // changeGraphData() {
  //   console.log("locl");
  // }
}
