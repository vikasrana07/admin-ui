import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

class Endpoint {
  endpointuuid: string;
  datacentercode: string;
  status: string;
  createdon: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  endpoints: Endpoint[] = [];
  statuses: any[];
  loading = true;
  items: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    this.endpoints.push({
      endpointuuid: '05d3d2bf-8e97-420f-84dd-4fba0d0ae321',
      datacentercode: 'SGPL',
      status: 'active',
      createdon: 'Tuesday, 19 May 2020, 05:01 PM'
    });
    this.endpoints.push({
      endpointuuid: '1e905596-bf81-46f1-8411-c20156e93009',
      datacentercode: 'JTHA',
      status: 'deployed',
      createdon: 'Wednesday, 21 November 2018, 10:34 PM'
    });
    this.endpoints.push({
      endpointuuid: 'c8bace98-7855-40f5-a95a-39983ab549f8',
      datacentercode: 'HKGG',
      status: 'failed',
      createdon: 'Wednesday, 17 March 2021, 03:20 PM'
    });
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    this.statuses = [
      { label: 'Failed', value: 'failed' },
      { label: 'Active', value: 'active' },
      { label: 'Deployed', value: 'deployed' }
    ];

    this.items = [
      { label: 'New', icon: 'pi pi-fw pi-plus' },
      { label: 'Open', icon: 'pi pi-fw pi-download' },
      { label: 'Undo', icon: 'pi pi-fw pi-refresh' }
    ];
  }
}
