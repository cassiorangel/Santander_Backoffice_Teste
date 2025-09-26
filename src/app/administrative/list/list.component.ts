import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { RecordsData } from 'src/app/models/records';
import { Subject, takeUntil } from 'rxjs';
import { AdminControlService } from 'src/app/admin-control/admin-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnDestroy {
  matDialogRef: MatDialogRef<ModalConfirmComponent>;
  name: string = "";

  private destroy$ = new Subject<void>();

  displayedColumns = ['id', 'name', 'area', 'porcentagem', 'farol', 'actions'];
  dataSource: MatTableDataSource<RecordsData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private adminControlService: AdminControlService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.listRegistros();
  }

  listRegistros() {
    this.adminControlService.getAll()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response: any) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.itemsPerPageLabel = 'Itens por página:';
          this.paginator._intl.nextPageLabel = 'Próxima página';
          this.paginator._intl.previousPageLabel = 'Página anterior'
        },
        error: (error) => {
          //this.visao = true;
          alert('algo errado');
        },
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onEdit(id: string) {
    this.adminControlService.loaderView(true);
    this.router.navigate(['editar', id], { relativeTo: this.route })
  }

  onDelete(controle: any) {
    this.matDialogRef = this.matDialog.open(ModalConfirmComponent, {
      data: {
        title: 'Atenção',
        name: `${controle?.name}?`
      },
      disableClose: true
    });

    this.matDialogRef.afterClosed().subscribe(res => {
      console.log(res, 'acao')
      if ((res == true)) {
        this.onDeleteControl(controle.id)
      }
    });
  }

  onDeleteControl(id: string) {
    this.adminControlService.delete(id)
      .subscribe({
        next: (response: any) => {
          console.log('r', response);
          alert('Registro excluído com sucesso!');
          this.listRegistros();
        },
        error: (err: any) => {
          console.log(err)
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(),
      this.destroy$.complete()
  };
}





