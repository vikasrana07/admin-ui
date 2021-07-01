import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertService {
    constructor(private messageService: MessageService) { }

    success(message: string, title: string = 'Success'): void {
        this.messageService.add({ severity: 'success', summary: title, detail: message });
    }

    info(message: string, title: string = 'Info'): void {
        this.messageService.add({ severity: 'info', summary: title, detail: message });
    }

    error(message: string, title: string = 'Error'): void {
        this.messageService.add({ severity: 'error', summary: title, detail: message });
    }

    clear(): void {
        this.messageService.clear();
    }
}
