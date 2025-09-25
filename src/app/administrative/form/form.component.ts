import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  private destroy$ = new Subject<void>();
  reactiveForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {

    this.reactiveForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      farol: new FormControl('', Validators.required),
      porcentagem: new FormControl('', Validators.required),
    });

    this.dadosRelatorio();
  }

  dadosRelatorio() {
      const registro = this.route?.snapshot?.params;
      console.log(registro)
  }

  controle() {

  }
}