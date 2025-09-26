import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  title: string;
  name: string;
  constructor(
    private _mdr: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log(data, 'dados')
    this.name = data.name;
    this.title = data.title;
  }
  CloseDialog() {
    this._mdr.close(false)
  }
}
