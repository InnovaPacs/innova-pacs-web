import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MainComponent } from './page/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './page/sign-up/sign-up.component';


@NgModule({
  declarations: [
    MainComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
