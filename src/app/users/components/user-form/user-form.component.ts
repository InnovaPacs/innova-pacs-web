import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, EMPTY, filter, map, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateUser, User } from '../../interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { FileService } from '../../../shared/services/file.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/interfaces/doctor.interface';

const DOCTOR_ROLES = ['MEDICO', 'RADIOLOGO'];

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css',
    standalone: false
})
export class UserFormComponent implements OnInit {
  private selectedFile!: File;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fileService = inject(FileService);
  private doctorService = inject(DoctorService);

  public title: string = 'Perfil';
  public id!: string;
  public doctors: Doctor[] = [];
  public showDoctorSelector = false;

  public userForm: FormGroup = this.fb.group({
    username: [null],
    email: [null],
    status: [null],
    role: [null],
    password: [null],
    doctorId: [null],
  });

  ngOnInit(): void {
    this.loadDoctors();
    this.watchRoleChanges();

    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.userService.getById(this.id);
      }),
      catchError(() => EMPTY)
    ).subscribe(user => {
      this.patchUserForm(user);
      this.userForm.get('status')?.enable();
      this.userForm.get('role')?.enable();
    });
  }

  private loadDoctors(): void {
    this.doctorService.getFullData().subscribe({
      next: (doctors) => (this.doctors = doctors),
      error: () => {},
    });
  }

  private watchRoleChanges(): void {
    this.userForm.get('role')!.valueChanges
      .pipe(startWith(this.userForm.get('role')!.value))
      .subscribe((role: string | null) => {
        this.showDoctorSelector = !this.id && DOCTOR_ROLES.includes(role ?? '');
        if (!this.showDoctorSelector) {
          this.userForm.get('doctorId')?.setValue(null, { emitEvent: false });
        }
      });
  }

  patchUserForm(user: User) {
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.roles[0]?.name,
      status: user.status,
    });
  }

  getUserFormValue(): UpdateUser {
    const { password, username, role, status, email, photo, doctorId } = this.userForm.value;

    return {
      username,
      role,
      status,
      email,
      password,
      photo,
      medicalOfficeId: this.authService.currentMedicalOfficeId() ?? undefined,
      doctorId: doctorId ?? undefined,
    };
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const data = this.getUserFormValue();

    if (this.id) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  handleUpdate(update: UpdateUser): void {
    if (this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          update.photo = response.id;
          return this.userService.update(update, this.id);
        })
      ).subscribe((result) => {
        this.authService.setUpdatedPhoto(result.photo);
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.update(update, this.id).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  handleCreate(update: UpdateUser): void {
    if (this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          update.photo = response.id;
          return this.userService.saveUser(update);
        })
      ).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.saveUser(update).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
