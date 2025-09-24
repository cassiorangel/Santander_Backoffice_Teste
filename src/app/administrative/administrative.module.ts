import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeRoutingModule } from './administrative-routing.module';
import { ListComponent } from './list/list.component';
import { MaterialModule } from '../shared/material/material-module';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdministrativeRoutingModule
  ]
})
export class AdministrativeModule { }
