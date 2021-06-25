import { Injectable } from '@angular/core';
import { Endpoint, Link } from '@app/_models';

import { HttpService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class CanvasService {
    connectionId = 0;
    currentZorderForddInfo = 5000;
    endPointsFromGUI = [];
    endPointsFromTTMS = [];
    sharedVportsFromTTMS = [];
    linksFromGUI = [];
    linksFromTTMS = [];

    newItemsToAddInGUIDB = [];
    itemsToBeRemovedFromGUIDB = [];
    endPointsToBeDrawn = [];

    endpoints: Endpoint[] = [];
    links: Link[] = [];
    constructor(
        private httpService: HttpService,
    ) { }

    parseEndpointsAndLinks(response: any) {
        this.connectionId = 0;
        this.endpoints = [];
        this.links = [];
        this.endPointsFromGUI = response.endpoints;
        this.linksFromGUI = response.links;
        this.endPointsFromTTMS = response.topologyTagEndpoints.endpoints;
        this.linksFromTTMS = response.topologyTagEndpoints.links;
        this.sharedVportsFromTTMS = response.topologyTagEndpoints.sharedvports;

        this.compareEndPoints();
        this.drawLinks();
        return { endpoints: this.endpoints, links: this.links };
    }

    compareEndPoints() {
        /* Add shared vports to endpoints object */
        if (this.sharedVportsFromTTMS.length) {
            for (let i = 0; i < this.sharedVportsFromTTMS.length; i++) {
                this.endPointsFromTTMS.push({ endpoint_uuid: this.sharedVportsFromTTMS[i], vports: [] });
            }
        }

        const ttmLen = this.endPointsFromTTMS.length;
        const guiLen = this.endPointsFromGUI.length;
        this.newItemsToAddInGUIDB = [];
        this.itemsToBeRemovedFromGUIDB = [];
        this.endPointsToBeDrawn = [];

        for (let i = 0; i < ttmLen; i++) {
            var itemFound = false;
            for (let j = 0; j < guiLen; j++) {
                if (this.endPointsFromGUI[j].type != null) {
                    if (this.endPointsFromGUI[j].type.toLowerCase() == 'eep') {
                        if (this.endPointsFromTTMS[i].endpoint_uuid == this.endPointsFromGUI[j].vport_uuid) {
                            this.endPointsFromGUI[j].statusObj = 'old';
                            this.endPointsToBeDrawn[this.endPointsToBeDrawn.length] = this.endPointsFromGUI[j];
                            itemFound = true;
                            break;
                        }
                    }
                    else {
                        if (this.endPointsFromTTMS[i].endpoint_uuid == this.endPointsFromGUI[j].endpoint_uuid) {
                            this.endPointsFromGUI[j].statusObj = 'old';
                            this.endPointsToBeDrawn[this.endPointsToBeDrawn.length] = this.endPointsFromGUI[j]
                            itemFound = true;
                            break;
                        }
                    }
                }
            }
            if (!itemFound) {
                this.endPointsFromTTMS[i].statusObj = 'new';
                this.newItemsToAddInGUIDB[this.newItemsToAddInGUIDB.length] = this.endPointsFromTTMS[i].endpoint_uuid;
            }
            // items to be removed from GUI DB
            for (let i = 0; i < guiLen; i++) {
                let itemFound = false;
                for (let j = 0; j < ttmLen; j++) {
                    if (this.endPointsFromGUI[i].type != null) {
                        if (this.endPointsFromGUI[i].type.toLowerCase() === 'eep') {
                            if (this.endPointsFromTTMS[j].endpoint_uuid === this.endPointsFromGUI[i].vport_uuid) {
                                itemFound = true;
                                break;
                            }
                        }
                        else {
                            if (this.endPointsFromTTMS[j].endpoint_uuid === this.endPointsFromGUI[i].endpoint_uuid) {
                                itemFound = true;
                                break;
                            }
                        }
                    }
                }
                if (itemFound === false) {
                    if ((this.endPointsFromGUI[i].endpoint_uuid == '' || this.endPointsFromGUI[i].endpoint_uuid == null) && (this.endPointsFromGUI[i].type.toLowerCase() == 'dia' || this.endPointsFromGUI[i].type.toLowerCase() == 'ipvpn' || this.endPointsFromGUI[i].type.toLowerCase() == 'vnf' || this.endPointsFromGUI[i].type.toLowerCase() == 'cp' || this.endPointsFromGUI[i].type.toLowerCase() == 'ucpe')) {
                        this.endPointsFromGUI[i].statusObj = 'old';
                        this.endPointsToBeDrawn[this.endPointsToBeDrawn.length] = this.endPointsFromGUI[i];

                    } else {
                        this.itemsToBeRemovedFromGUIDB[this.itemsToBeRemovedFromGUIDB.length] = this.endPointsFromGUI[i].gui_ep_uuid;
                    }
                }
            }
        }
        this.createEndpointsArray();
    }

    createEndpointsArray() {
        const showLoaderForEndpoints = ['rep', 'vnf'];
        const arrLen = this.endPointsToBeDrawn.length;
        for (let i = 0; i < arrLen; i++) {
            const arr = this.endPointsToBeDrawn;

            const objType = (arr[i].type && arr[i].type != null) ? arr[i].type.toLowerCase() : '';
            const objSubType = (arr[i].subtype && arr[i].subtype != null) ? arr[i].subtype.toLowerCase() : '';

            const endpoint = {
                guiuuid: arr[i].gui_ep_uuid,
                endpointuuid: arr[i].endpoint_uuid,
                endpointname: arr[i].endpoint_name,
                vportuuid: arr[i].vport_uuid,
                topologytaguuid: arr[i].topology_tag_uuid,
                datacenteruuid: arr[i].datacenter_uuid,
                iconclass: 'nextip',
                type: objType,
                subtype: objSubType,
                enabled: arr[i].enabled,
                isLoading: false,
                attachedEndPoints: [],
                connectionLineId: [],
                xpos: parseInt(arr[i].xpos),
                ypos: parseInt(arr[i].ypos)
            }
            if (showLoaderForEndpoints.indexOf(endpoint.type) !== -1) {
                endpoint.isLoading = true;
            }
            this.endpoints.push(endpoint);
        }
    }
    drawLinks() {

        let GUILinkLen = this.linksFromGUI.length;
        for (let j = 0; j < GUILinkLen; j++) {
            if (this.linksFromGUI[j].link_uuid == null) {
                if (this.linksFromGUI[j].status === '25' || this.linksFromGUI[j].status === '30') {
                    this.linksFromGUI[j].status = 'Failed'
                } else {
                    this.linksFromGUI[j].status = 'Pending';
                }
                /* draw line if both endpoints exists */
                const guiepuuidArr = this.linksFromGUI[j].gui_ep_uuids.split(',');

                if (this.isEndpointExistsOnCanvas(guiepuuidArr[0]) && this.isEndpointExistsOnCanvas(guiepuuidArr[1])) {
                    this.createLinkObjectForGUILinks(j, this.linksFromGUI[j].gui_link_uuid);
                }
            }
        }
        this.checkIfTheLinksDeployed();
    }

    getLinkData(links, linkid) {
        let linkObj: any = {};
        if (links.length) {
            for (let index = 0; index < links.length; index++) {
                if (links[index].linkid === linkid) {
                    linkObj = links[index];
                    break;
                }
            }
        }
        return linkObj;
    }
    checkIfTheLinksDeployed() {
        var jsonObj: any = {};
        var linksToCheckArr = [];
        for (var i = 0; i < this.linksFromTTMS.length; i++) {
            linksToCheckArr.push({ linkid: this.linksFromTTMS[i].linkid });
        }
        if (linksToCheckArr.length) {
            jsonObj.links = linksToCheckArr;
            this.httpService.get('86251759-72bf-4604-bd50-50e8afe9a897').subscribe(
                data => {
                    let linksResponse = data.links;
                    for (var i = 0; i < this.linksFromTTMS.length; i++) {
                        var linkData = this.getLinkData(linksResponse, this.linksFromTTMS[i].linkid);
                        if (linkData === -1) {
                            linkData = {
                                'linkid': this.linksFromTTMS[i].linkid,
                                'status': 'failed',
                                'isProtected': false
                            }
                        }
                        this.linksFromTTMS[i].isProtected = linkData.isProtected;
                        var linkStatus = (linkData.status).toLowerCase();
                        this.linksFromTTMS[i].status = linkStatus;
                        if (linkStatus === 'active') {
                            this.linksFromTTMS[i].status = 'deployed';
                        }
                        if (this.linksFromTTMS[i].status === 'deployed') {
                            this.createLinkObjectForTTMSLinks(i);
                        } else if (this.linksFromTTMS[i].status === 'updating') {
                            //this.createLinkObjectForUpdatingLinks(i);
                        } else {
                            /* var guiLinkId = this.getGUILinkUUDFromLinkId(this.linksFromTTMS[i].linkid)
                            if (guiLinkId != -1) {
                                this.createLinkObjectForFailedObject(i, this.linksFromGUI[guiLinkId].gui_link_uuid);
                            } */
                        }
                    }
                },
                error => {
                    console.log(error);
                });
        } else {
            //this.broadcastLinkObjects();
        }

    }
    createLinkObjectForGUILinks(id, guilinkuuid) {
        var gui_ep_uuidArr = this.linksFromGUI[id].gui_ep_uuids.split(',');
        var newEntryOrNot = this.checkIfLinkBetweenTheseEndPointExists(gui_ep_uuidArr);
        this.currentZorderForddInfo = this.currentZorderForddInfo + 1;
        if (newEntryOrNot === -1) {
            const draggedRef = 'outerdiv_' + gui_ep_uuidArr[0];
            const droppedRef = 'outerdiv_' + gui_ep_uuidArr[1];
            const draggedId = gui_ep_uuidArr[0];
            const droppedId = gui_ep_uuidArr[1];
            const connectionId = 'flow_' + this.connectionId;
            this.connectionId++;
            // tslint:disable-next-line: one-variable-per-declaration
            let cObj: any, lObj: any, rObj: any;
            cObj = {};
            cObj.id = 'center_' + connectionId.split('_')[1];
            cObj.xpos = 0;
            cObj.ypos = 0;
            cObj.degrees = 0;
            cObj.flowCount = 0;
            cObj.zorder = this.currentZorderForddInfo;

            cObj.infoshow = false;
            cObj.showDrafted = false;
            cObj.color = 'green';
            cObj.guilinkuuid = guilinkuuid;

            lObj = {};
            lObj.id = 'left_' + connectionId.split('_')[1];
            lObj.xpos = 0;
            lObj.ypos = 0;
            lObj.degrees = 0;
            lObj.flowCount = 0;
            lObj.zorder = this.currentZorderForddInfo;
            lObj.infoshow = false;
            lObj.showDrafted = false;
            lObj.color = 'grey';
            lObj.guilinkuuid = guilinkuuid;

            rObj = {};
            rObj.id = 'right_' + connectionId.split('_')[1];
            rObj.xpos = 0;
            rObj.ypos = 0;
            rObj.degrees = 0;
            rObj.flowCount = 0;
            rObj.zorder = this.currentZorderForddInfo;
            rObj.infoshow = false;
            rObj.showDrafted = false;
            rObj.color = 'red';
            rObj.guilinkuuid = guilinkuuid;

            const linkObj: any = {};
            linkObj.guilinkuuid = guilinkuuid;
            linkObj.connectionLineId = connectionId;
            linkObj.connectionBetweenArr = gui_ep_uuidArr;
            linkObj.aEndPointId = draggedRef;
            linkObj.zEndPointId = droppedRef;
            linkObj.draggedId = draggedId;
            linkObj.droppedId = droppedId;
            linkObj.centerObj = cObj;
            linkObj.leftObj = lObj;
            linkObj.rightObj = rObj;

            if (this.linksFromGUI[id].status.toLowerCase() === 'failed') {
                linkObj.flowBetweenArr = [this.linksFromGUI[id].gui_link_uuid];
                linkObj.failedFlowsArr = [this.linksFromGUI[id].gui_link_uuid];
                linkObj.drawFlowArr = [];
                linkObj.deployFlowArr = [];
                linkObj.flowIdInDB = [this.linksFromGUI[id].gui_link_uuid];

                linkObj.statusInDB = ['fail'];

            } else {
                linkObj.flowBetweenArr = [this.linksFromGUI[id].gui_link_uuid];
                linkObj.failedFlowsArr = [];
                linkObj.drawFlowArr = [this.linksFromGUI[id].gui_link_uuid];
                linkObj.deployFlowArr = [];
                linkObj.flowIdInDB = [this.linksFromGUI[id].gui_link_uuid];

                linkObj.statusInDB = ['save'];
            }
            this.addEntryInStageEndPoint(gui_ep_uuidArr, connectionId);

            this.links[this.links.length] = linkObj;
        } else {
            let arrRef = this.links[newEntryOrNot];
            if (this.linksFromGUI[id].status.toLowerCase() == 'failed') {
                arrRef.flowBetweenArr[arrRef.flowBetweenArr.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.failedFlowsArr[arrRef.failedFlowsArr.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.flowIdInDB[arrRef.flowIdInDB.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.statusInDB[arrRef.statusInDB.length] = 'fail';
            } else {

                arrRef.flowBetweenArr[arrRef.flowBetweenArr.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.drawFlowArr[arrRef.drawFlowArr.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.flowIdInDB[arrRef.flowIdInDB.length] = this.linksFromGUI[id].gui_link_uuid;
                arrRef.statusInDB[arrRef.statusInDB.length] = 'save';
            }

        }

    }

    createLinkObjectForTTMSLinks(id) {

        var linkId = this.linksFromTTMS[id].linkid;
        var isProtected = this.linksFromTTMS[id].isProtected;

        var GUIIDSource = '';
        var GUIIDDest = '';
        var endPointIdSource = this.getEndPointFromVport(this.linksFromTTMS[id].vport[0]);
        var endPointIdDestination = this.getEndPointFromVport(this.linksFromTTMS[id].vport[1]);

        if (endPointIdSource === -1) {
            GUIIDSource = this.getGUIUUIDFromEndPointId(this.linksFromTTMS[id].vport[0]);
        }
        else {
            GUIIDSource = this.getGUIUUIDFromEndPointId(endPointIdSource);
        }


        if (endPointIdDestination == -1) {
            GUIIDDest = this.getGUIUUIDFromEndPointId(this.linksFromTTMS[id].vport[1]);
        }
        else {
            GUIIDDest = this.getGUIUUIDFromEndPointId(endPointIdDestination);
        }

        var draggedRef = 'outerdiv_' + GUIIDSource;
        var droppedRef = 'outerdiv_' + GUIIDDest;
        var draggedId = GUIIDSource;
        var droppedId = GUIIDDest;
        var newEntryOrNot = this.checkIfLinkBetweenTheseEndPointExists([GUIIDSource, GUIIDDest]);
        var localLinkId = this.getLinkUUIDFromGUIDB(linkId)
        if (localLinkId === '') {
            localLinkId = linkId;
        }
        this.currentZorderForddInfo = this.currentZorderForddInfo + 1;
        if (newEntryOrNot === -1) {
            const connectionId = 'flow_' + this.connectionId;
            this.connectionId++;
            let cObj, lObj, rObj;
            cObj = {};
            cObj.id = 'center_' + connectionId.split('_')[1];
            cObj.xpos = 0;
            cObj.ypos = 0;
            cObj.degrees = 0;
            cObj.flowCount = 0;
            cObj.zorder = this.currentZorderForddInfo;
            cObj.infoshow = false;
            cObj.showDrafted = false;
            cObj.color = 'green';

            lObj = {};
            lObj.id = 'left_' + connectionId.split('_')[1];
            lObj.xpos = 0;
            lObj.ypos = 0;
            lObj.degrees = 0;
            lObj.flowCount = 0;
            lObj.zorder = this.currentZorderForddInfo;
            lObj.infoshow = false;
            lObj.showDrafted = false;
            lObj.color = 'grey';

            rObj = {};
            rObj.id = 'right_' + connectionId.split('_')[1];
            rObj.xpos = 0;
            rObj.ypos = 0;
            rObj.degrees = 0;
            rObj.flowCount = 0;
            rObj.zorder = this.currentZorderForddInfo;
            rObj.infoshow = false;
            rObj.showDrafted = false;
            rObj.color = 'red';

            const linkObj: any = {};
            linkObj.guilinkuuid = localLinkId;
            linkObj.connectionLineId = connectionId;
            linkObj.connectionBetweenArr = [GUIIDSource, GUIIDDest];
            linkObj.aEndPointId = draggedRef;
            linkObj.zEndPointId = droppedRef;
            linkObj.draggedId = draggedId;
            linkObj.droppedId = droppedId;
            linkObj.centerObj = cObj;
            linkObj.leftObj = lObj;
            linkObj.rightObj = rObj;

            linkObj.flowBetweenArr = [localLinkId];

            linkObj.linkuuid = linkId;
            linkObj.isProtected = isProtected;
            linkObj.drawFlowArr = [];

            const obj: any = {};
            obj.gui_link_uuid = localLinkId;
            obj.link_uuid = linkId;
            obj.isProtected = isProtected;

            linkObj.deployFlowArr = [obj];
            linkObj.flowIdInDB = [linkId];
            linkObj.statusInDB = ['deploy'];
            this.links[this.links.length] = linkObj;
            this.addEntryInStageEndPoint([GUIIDSource, GUIIDDest], connectionId);

        } else {
            const arrRef = this.links[newEntryOrNot];
            arrRef.flowBetweenArr[arrRef.flowBetweenArr.length] = localLinkId
            const obj: any = {};
            obj.gui_link_uuid = localLinkId;
            obj.link_uuid = linkId;
            obj.isProtected = isProtected;
            arrRef.deployFlowArr[arrRef.deployFlowArr.length] = obj;
            arrRef.flowIdInDB[arrRef.flowIdInDB.length] = linkId;
            arrRef.statusInDB[arrRef.statusInDB.length] = 'deploy';
        }
    }

    getGUIUUIDFromEndPointId(epId) {
        let guiId = '';
        for (let k = 0; k < this.endpoints.length; k++) {
            var idToCheck = '';
            if (this.endpoints[k].type.toLowerCase() === 'eep') {
                idToCheck = this.endpoints[k].vportuuid;
            } else {
                idToCheck = this.endpoints[k].endpointuuid;
            }
            if (epId === idToCheck) {
                guiId = this.endpoints[k].guiuuid;
                break;
            }
        }
        return guiId;
    }
    getLinkUUIDFromGUIDB(linkuuid) {
        let idToReturn = '';
        for (let s = 0; s < this.linksFromGUI.length; s++) {
            if (this.linksFromGUI[s].link_uuid === linkuuid) {
                idToReturn = this.linksFromGUI[s].gui_link_uuid;
                break;
            }
        }

        return idToReturn;
    }
    getEndPointFromVport(vport) {
        let epToReturn = -1;
        for (let k = 0; k < this.endPointsFromTTMS.length; k++) {
            for (let s = 0; s < this.endPointsFromTTMS[k].vports.length; s++) {
                if (this.endPointsFromTTMS[k].vports[s] === vport) {
                    epToReturn = this.endPointsFromTTMS[k].endpoint_uuid;
                    break;
                }
            }
        }

        return epToReturn;
    }
    addEntryInStageEndPoint(epArr, flowId) {

        for (let i = 0; i < this.endpoints.length; i++) {

            if (this.endpoints[i].guiuuid === epArr[0]) {
                let addInAttachedEndPoint = true;
                let addInConnectionLineId = true;
                for (let k = 0; k < this.endpoints[i].attachedEndPoints.length; k++) {
                    if (this.endpoints[i].attachedEndPoints[k] === epArr[1]) {
                        addInAttachedEndPoint = false;
                        break;
                    }
                }
                for (let k = 0; k < this.endpoints[i].connectionLineId.length; k++) {
                    if (this.endpoints[i].connectionLineId[k] === 'line_' + flowId.split('_')[1]) {
                        addInConnectionLineId = false;
                        break;
                    }
                }

                if (addInAttachedEndPoint) {
                    this.endpoints[i].attachedEndPoints[this.endpoints[i].attachedEndPoints.length] = epArr[1]
                }
                if (addInConnectionLineId) {
                    this.endpoints[i].connectionLineId[this.endpoints[i].connectionLineId.length] = 'line_' + flowId.split('_')[1]
                }
            }

            if (this.endpoints[i].guiuuid === epArr[1]) {
                let addInAttachedEndPoint = true;
                let addInConnectionLineId = true;
                for (let k = 0; k < this.endpoints[i].attachedEndPoints.length; k++) {

                    if (this.endpoints[i].attachedEndPoints[k] === epArr[0]) {
                        addInAttachedEndPoint = false;
                        break;
                    }
                }
                for (let k = 0; k < this.endpoints[i].connectionLineId.length; k++) {
                    if (this.endpoints[i].connectionLineId[k] === 'line_' + flowId.split('_')[1]) {
                        addInConnectionLineId = false;
                        break;
                    }
                }
                if (addInConnectionLineId) {
                    this.endpoints[i].connectionLineId[this.endpoints[i].connectionLineId.length] = 'line_' + flowId.split('_')[1];
                }
                if (addInAttachedEndPoint) {
                    this.endpoints[i].attachedEndPoints[this.endpoints[i].attachedEndPoints.length] = epArr[0]
                }
            }
        }

    }
    checkIfLinkBetweenTheseEndPointExists(gui_ep_uuidArr) {
        let valToReturn = -1;
        for (let k = 0; k < this.links.length; k++) {
            const revArr = new Array();
            revArr[0] = this.links[k].connectionBetweenArr[1];
            revArr[1] = this.links[k].connectionBetweenArr[0];

            if (gui_ep_uuidArr.toString() == this.links[k].connectionBetweenArr.toString() || gui_ep_uuidArr.toString() == revArr.toString()) {
                valToReturn = k;
                break;
            }
        }
        return valToReturn;

    }
    isEndpointExistsOnCanvas(id) {
        let isFound = false;
        if (this.endpoints) {
            for (const row of this.endpoints) {
                if (row.guiuuid === id) {
                    isFound = true;
                    break;
                }
            }
        }
        return isFound;
    }
    getEndpointByGuiId(endpoints, guiuuid) {
        let endpoint: any = {};
        if (endpoints && endpoints.length) {
            for (const row of this.endpoints) {
                if (guiuuid === row.guiuuid) {
                    endpoint = row;
                    break;
                }
            }
        }
        return endpoint;
    }
    getEndpointIndexByGuiId(endpoints, guiuuid) {
        let index = -1;
        if (endpoints && endpoints.length) {
            for (let i = 0; i < this.endpoints.length; i++) {
                if (guiuuid === this.endpoints[i].guiuuid) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
}