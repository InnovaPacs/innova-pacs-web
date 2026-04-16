import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, switchMap, catchError, EMPTY } from 'rxjs';
import { PacsConfigurationService } from '../../service/pacs-configuration.service';
import { PacsConfiguration, UpdatePacsConfiguration } from '../../interfaces/pacs-configuration.interface';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-pacs-configuration-form',
    templateUrl: './pacs-configuration-form.component.html',
    styleUrl: './pacs-configuration-form.component.css',
    standalone: false
})
export class PacsConfigurationFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(PacsConfigurationService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  public title: string = 'Crear Pacs';

  id!: string;

  private readonly requiredFieldLabels: Record<string, string> = {
    title: 'ITitle',
    ipAddress: 'Dirección IP',
    hl7port: 'Puerto HL7',
    dicomPort: 'Puerto DICOM',
    viewerUrl: 'URL visualizador',
  };

  public form: FormGroup = this.fb.group({
    title: [null, Validators.required],
    ipAddress: [null, Validators.required],
    hl7port: [null, Validators.required],
    dicomPort: [null, Validators.required],
    isActive: [null, Validators.required],
    viewerUrl: [null, Validators.required]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => {
        this.id = id!;
        return this.service.getById(this.id);
      }),
      catchError(() => EMPTY)
    ).subscribe(response => {
      this.title = `Editar pacs "${response.title}"`;
      this.patchForm(response);
    });
  }

  patchForm(response: PacsConfiguration) {
    this.form.patchValue({
      id: response.id,
      title: response.title,
      ipAddress: response.ipAddress,
      hl7port: response.hl7port,
      dicomPort: response.dicomPort,
      isActive: response.isActive
    });
  }

  getFormValue(): UpdatePacsConfiguration {
    const { title, ipAddress, hl7port, dicomPort, isActive, viewerUrl } = this.form.value;

    return { title, ipAddress, hl7port, dicomPort, isActive, viewerUrl };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const missing = Object.keys(this.requiredFieldLabels)
        .filter(key => this.form.get(key)?.invalid)
        .map(key => this.requiredFieldLabels[key]);
      this.loadingService.showRequiredFieldsAlert(missing);
      return;
    }

    const data = this.getFormValue();
    if(this.id) {
      this.handleUpdate(data);
    } else {
      this.handleCreate(data);
    }
  }

  handleUpdate(update: UpdatePacsConfiguration): void {
    this.service.update(this.id, update).subscribe(reposne => {
      this.router.navigate(['/pacs-configurations/main']);
    });
  }

  handleCreate(update: UpdatePacsConfiguration): void {
    this.service.save(update).subscribe(response => {
      this.router.navigate(['/pacs-configurations']);
    });
  }
}

