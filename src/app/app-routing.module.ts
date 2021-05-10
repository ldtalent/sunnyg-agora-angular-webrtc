import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicComponent } from './basic/basic.component';

const routes: Routes = [
  {
    path: 'user/:id',
    component: BasicComponent,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
