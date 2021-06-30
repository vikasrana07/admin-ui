import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {
  @Input() endpoint: any;
  @Output() dragMoveOuter = new EventEmitter();
  @Output() dragEndOuter = new EventEmitter();
  @Output() dragMoveInner = new EventEmitter();
  @Output() dragEndInner = new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }

  dragMovedInner(endpoint: any, position: any): void {
    const data: any = {};
    data.endpoint = endpoint;
    data.position = position;
    this.dragMoveInner.emit(data);
  }
  dragEndedOuter(endpoint: any, position: any): void {
    const data: any = {};
    data.endpoint = endpoint;
    data.position = position;
    this.dragEndOuter.emit(data);
  }

  dragMovedOuter(endpoint: any, position: any): void {
    const data: any = {};
    data.endpoint = endpoint;
    data.position = position;
    this.dragMoveOuter.emit(data);
  }
  dragEndedInner(endpoint: any, position: any): void {
    const data: any = {};
    data.endpoint = endpoint;
    data.position = position;
    this.dragEndInner.emit(data);
  }
}
