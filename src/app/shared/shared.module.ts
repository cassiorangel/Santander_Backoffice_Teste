import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { MaterialModule } from './material/material-module';
import { HeadingComponent } from './heading/heading.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    HeadingComponent,
    ModalConfirmComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    MaterialModule,
    ModalConfirmComponent,
    SpinnerComponent,
    HeadingComponent
  ]
})
export class SharedModule { }
