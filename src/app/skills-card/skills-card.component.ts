import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit {

  data = [
    [
      //Grecia
      { axis: "Liderazgo", value: 0.2 },
      { axis: "Arq. Software", value: 0.2 },
      { axis: "Ciencia de Datos", value: 0.2 },
      { axis: "UI/UX", value: 0.1 },
      { axis: "Frontend", value: 0.8 },
      { axis: "Backend", value: 0.5 }
    ]
  ];

  constructor() { }

  ngOnInit(): void {
  }

  changeGraphData() {
    console.log("locl");
    this.data = [
    [
      //Grecia
      { axis: "Leadership", value: 0.8 },
      { axis: "Soft. Arq", value: 0.3 },
      { axis: "Data Science", value: 0.7 },
      { axis: "UX/UI", value: 0.4 },
      { axis: "Front", value: 0.1 },
      { axis: "Back", value: 0.9 }
    ]
  ];
  }

}
