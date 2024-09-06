import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { MainComponent } from './pages/main/main.component';
import { UsersLayoutComponent } from './layout/users-layout/users-layout.component';
import { SharedModule } from '../shared/shared.module';
import { UserRowComponent } from './components/user-row/user-row.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    UsersLayoutComponent,
    UserRowComponent,
    UserFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
