import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    private ngxService: NgxUiLoaderService) { }

  start(): void {
    this.ngxService.start();
  }
  stop(): void {
    this.ngxService.stop();
  }
}
