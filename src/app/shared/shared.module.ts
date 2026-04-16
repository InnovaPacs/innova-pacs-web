import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { FileUrlPipe } from './pipes/file-url.pipe';
import { HasPermissionDirective } from './directives/has-permission.directive';



@NgModule({
  declarations: [
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    FileUrlPipe,
    HasPermissionDirective,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    FileUrlPipe,
    HasPermissionDirective,
  ]
})
export class SharedModule { }
