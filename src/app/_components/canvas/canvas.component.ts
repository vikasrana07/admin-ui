
import { Component,  OnInit,  ViewEncapsulation } from '@angular/core';

interface Endpoint {
  guiuuid: string;
  endpointuuid: string;
  endpointname: string;
  iconclass: string;
  xpos: number;
  ypos: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CanvasComponent implements OnInit {
  endpoints: Endpoint[] = [];
  line: any = {};
  constructor() { }

  ngOnInit() {

    this.endpoints.push({
      guiuuid: '85480c7a-dbdf-476b-b197-1617a56059fa',
      endpointuuid: '85480c7a-dbdf-476b-b197-1617a56059fa',
      endpointname: 'poc-ofsw8:25',
      iconclass: 'nextip',
      xpos: 10,
      ypos: 10
    });

    this.endpoints.push({
      guiuuid: '85480c7a-dbdf-476b-b197-1617a5605923',
      endpointuuid: '85480c7a-dbdf-476b-b197-1617a5605923',
      endpointname: 'poc-ofsw7:12',
      iconclass: 'nextip',
      xpos: 300,
      ypos: 10
    });
  }

  onDragEndOuter(data){
    const pos = this.getElementXYPos(data.event.source.element.nativeElement.style.transform);
    const index = this.endpoints.indexOf(data.endpoint);
    this.endpoints[index].xpos = pos.x;
    this.endpoints[index].ypos = pos.y;
  }

  getElementXYPos(transform){
    let pos = {x: 0, y: 0};
    const regex = /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/;
    const values = regex.exec(transform);
    pos.x = parseInt(values[1]);
    pos.y = parseInt(values[2]);
    return pos;
  }
  onDragMovedInner(data){
    var pos = this.getElementXYPos(data.event.source.element.nativeElement.style.transform);
    this.line.x1 = parseInt(data.endpoint.xpos) + 30;
    this.line.y1 = parseInt(data.endpoint.ypos) + 30;
    this.line.x2 = pos.x + this.line.x1+10;
    this.line.y2 = pos.y + this.line.y1+10;
  }
  onDragStartedInner(data){
    this.onDragMovedInner(data);
  }
  onDragEndInner(){
    this.line.x1 = 0;
    this.line.y1 = 0;
    this.line.x2 = 0;
    this.line.y2 = 0;
  }

  
}
