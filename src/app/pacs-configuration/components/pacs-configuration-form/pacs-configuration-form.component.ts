import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { PacsConfigurationService } from '../../service/pacs-configuration.service';
import { PacsConfiguration, UpdatePacsConfiguration } from '../../interfaces/pacs-configuration.interface';

@Component({
  selector: 'app-pacs-configuration-form',
  templateUrl: './pacs-configuration-form.component.html',
  styleUrl: './pacs-configuration-form.component.css'
})
export class PacsConfigurationFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(PacsConfigurationService);
  private router = inject(Router);
  
  id!: string;

  public form: FormGroup = this.fb.group({
    title: [null, Validators.required],
    ipAddress: [null, Validators.required],
    port: [null, Validators.required]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.service.getById(this.id);
      }),
      catchError(error => {
        console.error('Error al obtener el consultorio:', error);
        return EMPTY;
      })
    ).subscribe(response => {
      console.log("response: ", response);
      this.patchForm(response);
    });
  }

  patchForm(response: PacsConfiguration) {
    this.form.patchValue({
      id: response.id,
      title: response.title,
      ipAddress: response.ipAddress,
      port: response.port
    });
  }

  getFormValue(): UpdatePacsConfiguration {
    const { title, ipAddress, port } = this.form.value;

    return { title, ipAddress, port };
  }

  onSubmit() {
    if (this.form.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const data = this.getFormValue();
    console.log("data: ", data);
    if(this.id) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  handleUpdate(update: UpdatePacsConfiguration): void {
    console.log("data: ", update);
    this.service.update(this.id, update).subscribe(reposne => {
      this.router.navigate(['/pacs-configurations/main']);
    });
  }

  handleCreate(update: UpdatePacsConfiguration): void {
    console.log("data: ", update);
    this.service.save(update).subscribe(response => {
      this.router.navigate(['/pacs-configurations']);
    });
  }
}

