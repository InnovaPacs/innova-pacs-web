import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, EMPTY, filter, map, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateUser, User } from '../../interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private selectedFile!: File;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);
  public title: string = 'Perfil';
  public id!: string;
  private fileService = inject(FileService);

  public userForm: FormGroup = this.fb.group({
    username: [null],
    email: [null],
    status: [null],
    role: [null],
    password: [null]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.userService.getById(this.id);
      }),
      catchError(error => {
        console.error('Error al obtener el usuario:', error);
        return EMPTY;
      })
    ).subscribe(user => {
      this.patchUserForm(user);
    });

    this.disableControl('status');
    this.disableControl('role');
  }

  patchUserForm(user: User) {
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.roles[0].name,
      status: user.status
    });
  }

  getUserFormValue(): UpdateUser {
    const { password, username, role, status, email, photo} = this.userForm.value;

    return {
      username,
      role: role,
      status,
      email,
      password,
      photo
    };
  }

  onSubmit() {
    if (this.userForm.invalid) {
      console.warn('Form is invalid');
      return;
    }
    
    const data = this.getUserFormValue();

    if(this.id) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  private disableControl(controlName: string) {
    this.userForm.get(controlName)?.disable();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      this.selectedFile = file; 
    }
  }

  handleUpdate(update: UpdateUser): void {
    if(this.selectedFile) {
      this.fileService.save(this.selectedFile).pipe(
        switchMap((response) => {
          update.photo = response.id;
          return this.userService.update(update, this.id);
        })
      ).subscribe((result) => {
          this.authService.setUpdatedPhoto(result.photo);
          this.router.navigate(['/patients/main']);
        }
      );
    } else {
      this.userService.update(update, this.id).subscribe(reposne => {
        this.router.navigate(['/patients/main']);
      });
    }
  }
  
  handleCreate(update: UpdateUser): void {
    this.fileService.save(this.selectedFile).pipe(
      switchMap((response) => {
        update.photo = response.id;
        return this.userService.saveUser(update);
      })
    ).subscribe((result: User) => {
      this.router.navigate(['/patients/main']);
    });
  }
}
