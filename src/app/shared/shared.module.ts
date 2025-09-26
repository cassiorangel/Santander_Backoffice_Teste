import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { MaterialModule } from './material/material-module';
import { HeadingComponent } from './heading/heading.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    HeadingComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    MaterialModule,
    SpinnerComponent,
    HeadingComponent
  ]
})
export class SharedModule { }
