import { Component, OnInit } from '@angular/core';

import { POPAnimation } from './animation';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
  animations: POPAnimation
})
export class NetworkComponent implements OnInit {

  popFunction: any = {};
  addItemsState = 'closed';
  constructor() { }

  ngOnInit(): void {
    this.popFunction.showLocations = false;
    this.popFunction.showEndpoints = false;

    this.popFunction.functionState = 'default';
    this.popFunction.popState = 'default';
    this.popFunction.endpointState = 'default';
  }
  addItems(): void {
    this.addItemsState = 'open';
  }
  close(): void {
    this.addItemsState = 'closed';
  }
  onSelectPOP(): void {
    this.popFunction.functionState = 'activeState';
    this.popFunction.popState = 'open';
    this.popFunction.endpointState = 'activeState';
    this.popFunction.showLocations = true;
  }
  onSelectLocation(): void {
    this.popFunction.popState = 'activeState';
    this.popFunction.endpointState = 'open';
    this.popFunction.showEndpoints = true;
  }
}
