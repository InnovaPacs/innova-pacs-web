import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudyService } from '../../services/study.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MedicalOfficeService } from '../../../medical-office/services/medilca-office.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css',
})
export class ViewerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private studyService = inject(StudyService);
  private authService = inject(AuthService);
  private medicalOfficeService = inject(MedicalOfficeService);

  public viewerUrl: SafeResourceUrl | null = null;
  public loading = true;
  public error: string | null = null;

  async ngOnInit(): Promise<void> {
    const studyId = this.route.snapshot.paramMap.get('studyId');
    if (!studyId) {
      this.error = 'ID de estudio no encontrado.';
      this.loading = false;
      return;
    }

    try {
      let medicalOfficeId = this.authService.currentMedicalOfficeId();
      if (!medicalOfficeId) {
        const medicalOffice = await firstValueFrom(
          this.medicalOfficeService.getLastByUserId(null)
        );
        medicalOfficeId = medicalOffice.id;
        this.authService.selectMedicalOffice(medicalOffice.id);
      }

      const [study, pacsConfig] = await Promise.all([
        firstValueFrom(this.studyService.getById(studyId)),
        firstValueFrom(
          this.medicalOfficeService.getPacsConfigurationByMedicalOffice(
            medicalOfficeId!
          )
        ),
      ]);

      if (!study.studyInstance) {
        this.error = 'Este estudio no tiene imágenes DICOM asociadas.';
        this.loading = false;
        return;
      }

      const url = pacsConfig.viewerUrl + study.studyInstance;
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch {
      this.error = 'Error al cargar el visualizador. Intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/studies/main']);
  }
}
