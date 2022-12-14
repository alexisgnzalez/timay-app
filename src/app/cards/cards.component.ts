import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardsComponent implements OnInit {

  @Input() data: any;
  @Output() theCardIs: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToFinal() {
    this.router.navigate(['/final']);
  }

  justClicked(place: string) {
    this.theCardIs.emit(place);
  }

}
