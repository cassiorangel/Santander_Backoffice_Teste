import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { RecordsData } from 'src/app/models/records';
import { Subject, takeUntil } from 'rxjs';
import { AdminControlService } from 'src/app/admin-control/admin-control.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  displayedColumns = ['id', 'name', 'porcentagem', 'farol', 'actions'];
  dataSource: MatTableDataSource<RecordsData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private adminControlService: AdminControlService
  ) { }

  ngAfterViewInit() {
    this.adminControlService.getAll()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response: any) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  ngOnDestroy(): void {
    this.destroy$.next(),
    this.destroy$.complete()
  };
}





