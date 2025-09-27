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
  farol: any = [];
  acao: boolean;

  constructor(
    private router: Router,
    private adminControlService: AdminControlService,
    private route: ActivatedRoute) {

    this.reactiveForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      farol: new FormControl('1'),
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

      this.adminControlService.loaderView(false);
    }, 2000);

  }

  goBack(): void {
    this.router.navigate(['/relatorio']);
  }

  onSubmit() {

    if (this.acao) {

      return this.adminControlService.updateControl(this.montaObj(this.reactiveForm.value)).subscribe({
        next: (response: any) => {
          this.updateForm(response);
           this.adminControlService.openSnackBar(`Colaborador(a) ${response?.name}, atualizado(a) com sucesso!`, `Fechar`, `success-snackbar`, 3000);
          this.router.navigate(['/relatorio']);
        },
        error: (err: any) => {
          //this.error = 'Algo de errado';
          console.log(err)
        }
      });

    }

    return this.adminControlService.createControl(this.montaObj(this.reactiveForm.value))
      .subscribe({
        next: (response: any) => {
          this.updateForm(response);
           this.adminControlService.openSnackBar(`Controle cadastrado com sucesso`, `Fechar`, `success-snackbar`, 3000);
          this.router.navigate(['/relatorio']);
        },
        error: (err: any) => {
          //this.error = 'Algo de errado';
          console.log(err)
        }
      });
  }


  montaObj(objeto: any) {
    let filtro = this.farol.filter((res: any) => res.id === objeto.farol);

    let obj = {
      "id": objeto?.id,
      "name": objeto?.name,
      "area": objeto?.area,
      "porcentagem": this.reactiveForm.value?.porcentagem,
      "farol": [
        {
          "id": filtro[0]?.id,
          "name": filtro[0]?.name.toLowerCase()
        }
      ]
    }
    if (this.acao) {
      return obj;
    }
    delete obj?.id;
    return obj;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}