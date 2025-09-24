import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'relatorio',
    loadChildren: () =>
      import('./administrative/administrative.module').then((m) => m.AdministrativeModule),
  },
  {
    path: '',
    redirectTo: '/relatorio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
