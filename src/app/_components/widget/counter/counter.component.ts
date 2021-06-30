import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'div[app-counter]',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

  @Input() title: string;
  @Input() count: string;
  constructor() { }

  ngOnInit(): void {
  }
}
