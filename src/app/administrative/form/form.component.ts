import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminControlService } from 'src/app/admin-control/admin-control.service';
import { RecordsData } from 'src/app/models/records';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  reactiveForm!: FormGroup;
  farols: any = []

  constructor(
    private router: Router,
    private adminControlService: AdminControlService,
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

  get name() {
    return this.reactiveForm.get('name')!;
  }

  get area() {
    return this.reactiveForm.get('area')!;
  }

  get farol() {
    return this.reactiveForm.get('farol')!;
  }

    get porcentagem() {
    return this.reactiveForm.get('farol')!;
  }

  dadosRelatorio() {
    // const registro: any = this.route?.snapshot?.params['id'];
    this.adminControlService.getStatus()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response: any) => {
          this.farols = response;
        },
        error: (err: any) => {
          //this.error = 'Algo de errado';
          console.log(err)
        }
      });


    if (this.route?.snapshot?.params['id']) {
      console.log('registro', this.route?.snapshot?.params['id'])
      this.adminControlService.loadById(this.route?.snapshot?.params['id'])
        .subscribe({
          next: (response: any) => {
            this.updateForm(response);
          },
          error: (err: any) => {
            //this.error = 'Algo de errado';
            console.log(err)
          }
        });
    }
    // console.log(registro)
    //this.updateForm(registro);
  }

  updateForm(relatorio: RecordsData) {
    setTimeout(() => {
      this.reactiveForm.patchValue({
        id: relatorio.id,
        name: relatorio.name,
        area: relatorio.area,
        farol: relatorio.farol[0].id,
        porcentagem: relatorio.porcentagem
      });
    }, 1000);

  }

  controle() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}