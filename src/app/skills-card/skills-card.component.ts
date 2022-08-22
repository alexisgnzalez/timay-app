import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit {

  @Input() charData: any;
  @Input() currentSkill: any;
  @Input() color: string = 'steelblue';

  /*data = [
    [
      //Grecia
      { axis: "Liderazgo", value: 0.2, icon: "" },
      { axis: "Arq. Software", value: 0.2, icon: "" },
      { axis: "Ciencia de Datos", value: 0.2, icon: "" },
      { axis: "UI/UX", value: 0.1, icon: "" },
      { axis: "Frontend", value: 0.8, icon: "" },
      { axis: "Backend", value: 0.5, icon: "" }
    ]
  ];*/

  constructor() { }

  ngOnInit(): void {
    // this.charData = this.data.generalSkills.data;
  }

  changeGraphData() {
    console.log("locl");
/*    this.data = [
      [
        //Grecia
        { axis: "Leadership", value: 0.8, icon: "" },
        { axis: "Soft. Arq", value: 0.3, icon: "" },
        { axis: "Data Science", value: 0.7, icon: "" },
        { axis: "UX/UI", value: 0.4, icon: "" },
        { axis: "Front", value: 0.1, icon: "" },
        { axis: "Back", value: 0.9, icon: "" }
      ]
    ];*/
  }

}
