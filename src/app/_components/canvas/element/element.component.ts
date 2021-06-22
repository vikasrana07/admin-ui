import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CdkDragEnd, CdkDragDrop, CdkDragMove, CdkDragEnter, CdkDragExit} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {
  dragPosition = {x: 0, y: 0};
  @Input() endpoint: any;
  @Output() dragEndOuter = new EventEmitter();
  @Output() dragMoveInner = new EventEmitter();
  @Output() dragEndInner = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log(this.endpoint);
  }
  
  dragEndedOuter(event: CdkDragEnd){
    const data: any = {};
    data.endpoint = this.endpoint;
    data.event = event;
    this.dragEndOuter.emit(data);
  }

  dragMovedInner(event: CdkDragMove) {
    const data: any = {};
    data.endpoint = this.endpoint;
    data.event = event;
    this.dragMoveInner.emit(data);
  }
  dragEndedInner(event: CdkDragEnd){
    const data: any = {};
    data.endpoint = this.endpoint;
    data.event = event;
    this.dragPosition = {x: 0, y: 0};
    this.dragEndInner.emit(data);
  }
  dropped(event: any) {
    console.log(event);
  }
}
