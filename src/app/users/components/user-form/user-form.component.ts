import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, EMPTY, filter, map, switchMap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateUser, User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  
  id!: string;

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
  }

  patchUserForm(user: User) {
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.roles[0].name,
      status: user.status
    });

    console.log(this.userForm.get('role')!.value);
  }

  getUserFormValue(): UpdateUser {
    const { password, username, role, status, email} = this.userForm.value;

    return {
      username,
      role: role,
      status,
      email,
      password,
    };
  }

  onSubmit() {
    const user = this.getUserFormValue();

    if(this.id) {
      this.userService.updateUserById(this.id, user).subscribe();
    }

    if(!this.id) {
      this.userService.saveUser(user).subscribe();
    }

    this.router.navigate(['/users']);
  }
}
