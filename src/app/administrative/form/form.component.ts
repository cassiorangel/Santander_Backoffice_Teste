import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminControlService } from 'src/app/admin-control/admin-control.service';
import { RecordsData } from 'src/app/models/records';
import { Location } from '@angular/common';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  reactiveForm!: FormGroup;
  farol: any = [];
  acao: boolean;

  constructor(
    private router: Router,
    private adminControlService: AdminControlService,
    private location: Location,
    private route: ActivatedRoute) {

    this.reactiveForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      farol: new FormControl(1),
      porcentagem: new FormControl('', Validators.required),
    });

    this.dadosRelatorio();
  }

  dadosRelatorio() {
    // const registro: any = this.route?.snapshot?.params['id'];
    this.adminControlService.getStatus()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response: any) => {
          this.farol = response;
        },
        error: (err: any) => {
          //this.error = 'Algo de errado';
          console.log(err)
        }
      });


    if (this.route?.snapshot?.params['id']) {
      this.acao = true;
      return this.adminControlService.loadById(this.route?.snapshot?.params['id'])
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
    return this.acao = false;
    // console.log(registro)
    //this.updateForm(registro);
  }

  updateForm(relatorio: RecordsData) {
    setTimeout(() => {
      this.reactiveForm.patchValue({
        id: relatorio?.id,
        name: relatorio?.name,
        area: relatorio?.area,
        farol: relatorio?.farol[0]?.id,
        porcentagem: relatorio?.porcentagem
      });
    }, 500);

  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    if (this.acao) {
      console.log(this.reactiveForm.value)
      return
    }
    delete this.reactiveForm.value.id
    return this.adminControlService.createControl(this.reactiveForm.value)
      .subscribe({
        next: (response: any) => {
          this.updateForm(response);
          alert('Controle cadastrado com sucesso');
          this.router.navigate(['/relatorio'])
        },
        error: (err: any) => {
          //this.error = 'Algo de errado';
          console.log(err)
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}