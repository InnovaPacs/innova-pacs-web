import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'patients',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule)
  },
  {
    path: 'appointments',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'users',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'calendar',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
  },
  {
    path: 'medical-offices',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./medical-office/medical-office.module').then(m => m.MedicalOfficeModule)
  },
  {
    path: 'doctors',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./doctors/doctors.module').then(m => m.DoctorsModule)
  },
  {
    path: 'radiology-exams',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./radiology-exam/radiology-exam.module').then(m => m.RadiologyExamModule)
  },
  {
    path: '**',
    redirectTo: 'patients'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
