import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
