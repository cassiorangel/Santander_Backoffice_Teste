import { Component } from '@angular/core';
import { AdminControlService } from './admin-control/admin-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'backoffice';

  viewLoader: boolean = false;

  constructor(
      private adminControlService: AdminControlService,
    ) { 
      this.adminControlService.viewEventEmmiter.subscribe(res => this.viewLoader = res);
    }
}
