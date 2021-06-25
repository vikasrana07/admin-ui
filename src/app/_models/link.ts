export class Link {
    guilinkuuid: string;
    connectionLineId: string;
    aEndPointId: string;
    zEndPointId: string;
    draggedId: string;
    droppedId: string;
    linkuuid?: string;
    isProtected?: string;
    connectionBetweenArr: any;
    centerObj: any;
    leftObj: any;
    rightObj: any;
    flowBetweenArr: any;
    failedFlowsArr: any;
    drawFlowArr: any;
    deployFlowArr: any;
    updatingFlowArr?: any;
    flowIdInDB: any;
    statusInDB: any;
}
