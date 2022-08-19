import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  resizeIframe(obj: any) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
  }

}
