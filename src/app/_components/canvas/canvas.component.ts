
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Endpoint, Link } from '@app/_models';
import { HttpService, CanvasService, LoaderService } from '@app/_services';

declare var $: any;

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CanvasComponent implements OnInit {
  line: any = {};
  svgLines: Line[] = [];
  endpoints: Endpoint[] = [];
  links: Link[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private canvasService: CanvasService,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this.line.x1 = 0;
    this.line.y1 = 0;
    this.line.x2 = 0;
    this.line.y2 = 0;
    this.loaderService.start();
    this.getEndpointAndLinks();
  }
  onDragMovedInner(data: any) {
    let pos = data.position;
    this.line.x1 = data.endpoint.xpos + 30;
    this.line.y1 = data.endpoint.ypos + 30;
    this.line.x2 = pos.left + this.line.x1 + 10;
    this.line.y2 = pos.top + this.line.y1 + 10;
    this.cdr.detectChanges();
  }

  onDragMovedOuter(data: any) {
    /* const index = this.canvasService.getEndpointIndexByGuiId(this.endpoints, data.endpoint.guiuuid);
    if (index !== -1) {
      this.endpoints[index].xpos = data.endpoint.xpos;
      this.endpoints[index].ypos = data.endpoint.ypos;
    } */
    this.drawLineOnDrag(data);
    this.onDragEndedOuter(data);
    this.cdr.detectChanges();
  }
  onDragEndedOuter(data: any) {
    const idInObj = this.getEndPointIndexFromArr(data.endpoint.guiuuid);
    const len = this.endpoints[idInObj].connectionLineId.length;


    for (let i = 0; i < len; i++) {

      const lineId = this.endpoints[idInObj].connectionLineId[i];
      const flowId = '#center_' + lineId.split('_')[1];
      const lFlowId = '#left_' + lineId.split('_')[1];
      const rFlowId = '#right_' + lineId.split('_')[1];
      $(flowId).removeClass('hide');
      $(lFlowId).removeClass('hide');
      $(rFlowId).removeClass('hide');
      this.updateLineObject(data.endpoint.guiuuid, this.endpoints[idInObj].attachedEndPoints[i], this.endpoints[idInObj].connectionLineId[i]);
      this.cdr.detectChanges();
    }


  }

  updateLineObject(source, destination, id) {
    try {
      const linkObjRefId = this.getLinkIndexFromArr(id)

      const tempStrCenter = this.addFlowNumberInfoInBetween(source, destination, 'center');
      this.links[linkObjRefId].centerObj.xpos = tempStrCenter.split('::')[0] + 'px';
      this.links[linkObjRefId].centerObj.ypos = tempStrCenter.split('::')[1] + 'px';


      const tempStrLeft = this.addFlowNumberInfoInBetween(source, destination, 'left');
      this.links[linkObjRefId].leftObj.xpos = tempStrLeft.split('::')[0] + 'px';
      this.links[linkObjRefId].leftObj.ypos = tempStrLeft.split('::')[1] + 'px';


      const tempStrRight = this.addFlowNumberInfoInBetween(source, destination, 'right');
      this.links[linkObjRefId].rightObj.xpos = tempStrRight.split('::')[0] + 'px';
      this.links[linkObjRefId].rightObj.ypos = tempStrRight.split('::')[1] + 'px';

    } catch (e) { console.log(e) }

  }

  addFlowNumberInfoInBetween(source, destination, dir) {

    const outDivRefFrom = $('#outerDiv_' + source).offset();
    const outDivRefTo = $('#outerDiv_' + destination).offset();
    let pointToAddX;
    let pointToAddY;
    let degree;
    let divideFactor;
    let divideFactorYG;
    let divideFactorYL;
    try {
      var networkDivRef = $('#canvas');
      if (dir === 'center') {
        divideFactor = 2;
        divideFactorYG = 2;
        divideFactorYL = 2;
      } else if (dir === 'left') {
        divideFactor = 4;
        divideFactorYG = 4;
        divideFactorYL = 4 / 3;
      } else if (dir === 'right') {
        divideFactor = 4 / 3;
        divideFactorYG = 4 / 3;
        divideFactorYL = 4;
      }

      if (outDivRefFrom.left > outDivRefTo.left) {
        pointToAddX = (outDivRefFrom.left - outDivRefTo.left) / divideFactor + (outDivRefTo.left - networkDivRef.offset().left) + 20;
        if (dir === 'left') {
          divideFactorYG = 4;
          divideFactorYL = 4 / 3;
        } else if (dir === 'right') {
          divideFactorYG = 4 / 3;
          divideFactorYL = 4;
        }
      } else {
        pointToAddX = (outDivRefTo.left - outDivRefFrom.left) / divideFactor + (outDivRefFrom.left - networkDivRef.offset().left) + 20;
        if (dir === 'left') {
          divideFactorYG = 4 / 3;
          divideFactorYL = 4;
        } else if (dir === 'right') {
          divideFactorYG = 4;
          divideFactorYL = 4 / 3;
        }
      }

      if (outDivRefFrom.top > outDivRefTo.top) {
        pointToAddY = (outDivRefFrom.top - outDivRefTo.top) / divideFactorYG + (outDivRefTo.top - networkDivRef.offset().top) + 25;
      } else {
        pointToAddY = (outDivRefTo.top - outDivRefFrom.top) / divideFactorYL + (outDivRefFrom.top - networkDivRef.offset().top) + 25;
      }
      var rotationDegreTop = outDivRefFrom.top - outDivRefTo.top;
      var rotationDegreLeft = outDivRefFrom.left - outDivRefTo.left;
      degree = Math.atan2(rotationDegreTop, rotationDegreLeft) * (180 / Math.PI)
    }
    catch (e) { }
    return pointToAddX + '::' + pointToAddY + '::' + degree;
  }
  onDragEndedInner() {
    this.line.x1 = 0;
    this.line.y1 = 0;
    this.line.x2 = 0;
    this.line.y2 = 0;
    this.cdr.detectChanges();
  }

  getEndpointAndLinks() {
    this.httpService.get('23e965da-5d2a-438e-b343-9f22a3e84f9e').subscribe(
      data => {
        const response = this.canvasService.parseEndpointsAndLinks(data);
        this.endpoints = response.endpoints;
        this.links = response.links;
        console.log(response);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.drawLinks();
        }, 1000);
      },
      error => {
        this.loaderService.stop();
        console.log(error);
      });
  }

  drawLinks() {
    try {
      for (let s = 0; s < this.links.length; s++) {
        this.checkIfDraftAndFailedInfoShown(s);
      }
      for (let i = 0; i < this.endpoints.length; i++) {
        this.checkIfLineToBeDrawFromPToP(this.endpoints[i].guiuuid);
      }
      this.loaderService.stop();

    } catch (e) {
      console.log(e);
    }
  }
  //check and start creating a line between two endpoints if there is a connection
  checkIfLineToBeDrawFromPToP(guiuuid: string) {
    if (guiuuid) {
      const idInObj = this.getEndPointIndexFromArr(guiuuid);
      for (let i = 0; i < this.endpoints[idInObj].attachedEndPoints.length; i++) {
        this.drawLineFromParentToParent(guiuuid, this.endpoints[idInObj].attachedEndPoints[i], i)
      }
      this.cdr.detectChanges();
    }
  }

  getSVGLinkIndexFromArr(id: string) {
    let numToReturn = -1;
    for (let i = 0; i < this.svgLines.length; i++) {
      if (this.svgLines[i].id === id) {
        numToReturn = i;
        break;
      }
    }
    return numToReturn;
  }
  drawLineOnDrag(data) {
    const pos = data.position;
    for (let i = 0; i < data.endpoint.connectionLineId.length; i++) {
      const linkRefId = this.getSVGLinkIndexFromArr(data.endpoint.connectionLineId[i]);
      const sourceEp = this.canvasService.getEndpointByGuiId(this.endpoints, data.endpoint.attachedEndPoints[i]);
      this.svgLines[linkRefId] = {
        id: this.svgLines[linkRefId].id,
        x1: sourceEp.xpos + 35,
        y1: sourceEp.ypos + 35,
        x2: pos.left + 35,
        y2: pos.top + 35,
        color: this.svgLines[linkRefId].color
      };
    }
  }
  //draw a line between parent to parent
  drawLineFromParentToParent(lineFrom: string, lineTo: string, loopval: number) {
    try {

      const sourceIndex = this.getEndPointIndexFromArr(lineFrom);
      const destinationIndex = this.getEndPointIndexFromArr(lineTo);

      const lineName = this.endpoints[sourceIndex].connectionLineId[loopval];
      const linkRefId = this.getLinkIndexFromArr(lineName);
      let lineColor = '#00baff';
      if (this.links[linkRefId].deployFlowArr && this.links[linkRefId].deployFlowArr.length > 0) {
        lineColor = '#99ca3c';
      }

      if (this.links[linkRefId].updatingFlowArr && this.links[linkRefId].updatingFlowArr.length > 0) {
        lineColor = '#ffc500';
      }
      const aLine = document.getElementById(lineName);
      if (aLine == null) {
        this.svgLines[this.svgLines.length] = {
          id: lineName,
          x1: this.endpoints[sourceIndex].xpos + 30,
          y1: this.endpoints[sourceIndex].ypos + 35,
          x2: this.endpoints[destinationIndex].xpos + 30,
          y2: this.endpoints[destinationIndex].ypos + 35,
          color: lineColor
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  getLinkIndexFromArr(id: string) {
    let numToReturn = -1;
    for (let i = 0; i < this.links.length; i++) {
      if (this.links[i].connectionLineId.split('_')[1] === id.split('_')[1]) {
        numToReturn = i;
        break;
      }
    }
    return numToReturn;
  }
  getEndPointIndexFromArr(guiuuid: string) {
    let numToReturn = -1;
    for (let i = 0; i < this.endpoints.length; i++) {
      if (this.endpoints[i].guiuuid === guiuuid) {
        numToReturn = i;
        break;
      }
    }
    return numToReturn;
  }
  checkIfDraftAndFailedInfoShown(lineId: number) {
    if (this.links[lineId].deployFlowArr.length === 0) {
      if (this.links[lineId].failedFlowsArr.length === 0) {
        this.links[lineId].centerObj.flowCount = this.links[lineId].drawFlowArr.length;
        this.links[lineId].centerObj.color = 'grey';
        this.links[lineId].leftObj.flowCount = this.links[lineId].deployFlowArr.length;
        this.links[lineId].leftObj.deployedFlowArr = this.links[lineId].deployFlowArr;
        this.links[lineId].leftObj.color = 'green';
        this.links[lineId].rightObj.flowCount = this.links[lineId].failedFlowsArr.length;
        this.links[lineId].rightObj.color = 'red';
      }
      if (this.links[lineId].failedFlowsArr.length > 0) {
        this.links[lineId].rightObj.flowCount = this.links[lineId].drawFlowArr.length;
        this.links[lineId].rightObj.color = 'grey';
        this.links[lineId].leftObj.flowCount = this.links[lineId].deployFlowArr.length;
        this.links[lineId].leftObj.deployedFlowArr = this.links[lineId].deployFlowArr;
        this.links[lineId].leftObj.color = 'green';
        this.links[lineId].centerObj.flowCount = this.links[lineId].failedFlowsArr.length;
        this.links[lineId].centerObj.color = 'red';
      }

    } else if (this.links[lineId].drawFlowArr.length === 0) {
      if (this.links[lineId].deployFlowArr.length === 0) {
        this.links[lineId].centerObj.flowCount = this.links[lineId].failedFlowsArr.length;
        this.links[lineId].centerObj.color = 'red';
        this.links[lineId].leftObj.flowCount = this.links[lineId].drawFlowArr.length;
        this.links[lineId].leftObj.color = 'grey';
        this.links[lineId].rightObj.flowCount = this.links[lineId].deployFlowArr.length;
        this.links[lineId].rightObj.deployedFlowArr = this.links[lineId].deployFlowArr;
        this.links[lineId].rightObj.color = 'green';
      }

      if (this.links[lineId].deployFlowArr.length > 0) {
        this.links[lineId].centerObj.flowCount = this.links[lineId].deployFlowArr.length;
        this.links[lineId].centerObj.deployedFlowArr = this.links[lineId].deployFlowArr;
        this.links[lineId].centerObj.color = 'green';
        this.links[lineId].leftObj.flowCount = this.links[lineId].drawFlowArr.length;
        this.links[lineId].leftObj.color = 'grey';
        this.links[lineId].rightObj.flowCount = this.links[lineId].failedFlowsArr.length;
        this.links[lineId].rightObj.color = 'red';
      }

    } else if (this.links[lineId].deployFlowArr.length > 0) {
      this.links[lineId].centerObj.flowCount = this.links[lineId].deployFlowArr.length;
      this.links[lineId].centerObj.deployedFlowArr = this.links[lineId].deployFlowArr;
      this.links[lineId].centerObj.color = 'green';
      this.links[lineId].leftObj.flowCount = this.links[lineId].drawFlowArr.length;
      this.links[lineId].leftObj.color = 'grey';
      this.links[lineId].rightObj.flowCount = this.links[lineId].failedFlowsArr.length;
      this.links[lineId].rightObj.color = 'red';
    }

    if (this.links[lineId].centerObj.flowCount > 0) {
      this.links[lineId].centerObj.showDrafted = true;
    } else {
      this.links[lineId].centerObj.showDrafted = false;
    }
    if (this.links[lineId].leftObj.flowCount > 0) {
      this.links[lineId].leftObj.showDrafted = true;
    } else {
      this.links[lineId].leftObj.showDrafted = false;
    }
    if (this.links[lineId].rightObj.flowCount > 0) {
      this.links[lineId].rightObj.showDrafted = true;
    } else {
      this.links[lineId].rightObj.showDrafted = false;
    }
  }
}
