import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AlertService {
    constructor(private toastr: ToastrService) { }

    success(message: string, title: string = 'Success'): void {
        this.toastr.success(message, title);
    }

    error(message: string, title: string = 'Error'): void {
        this.toastr.error(message, title);
    }
}
