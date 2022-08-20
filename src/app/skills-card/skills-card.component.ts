import { Component, OnInit, ViewChild } from '@angular/core';
import { Runtime, Inspector } from "@observablehq/notebook-runtime";
import notebook from "../assets/img/radar-char-1";

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('directedGraph') directedGraph: ElementRef;

  ngAfterContentInit() {
    Runtime.load(notebook, Inspector.into(this.directedGraph.nativeElement));
  }

}
