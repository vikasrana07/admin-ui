import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
})
export class LinkComponent implements OnInit, OnChanges {
  @Input() link: any;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    console.log(this.link);
  }

}
