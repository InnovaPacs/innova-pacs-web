import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { PatientPortalService } from '../../services/patient-portal.service';

@Component({
  selector: 'app-patient-viewer',
  templateUrl: './patient-viewer.component.html',
})
export class PatientViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private patientPortalService = inject(PatientPortalService);

  public viewerUrl: SafeResourceUrl | null = null;
  public loading = true;
  public error: string | null = null;

  async ngOnInit(): Promise<void> {
    if (!this.patientPortalService.verifiedPatient()) {
      this.router.navigateByUrl('/patient-portal/verify');
      return;
    }

    const studyId = this.route.snapshot.paramMap.get('studyId');
    if (!studyId) {
      this.error = 'ID de estudio no encontrado.';
      this.loading = false;
      return;
    }

    try {
      const study = await firstValueFrom(
        this.patientPortalService.getStudyById(studyId)
      );

      if (!study.studyInstance) {
        this.error = 'Este estudio no tiene imágenes DICOM asociadas.';
        this.loading = false;
        return;
      }

      const pacsConfig = await firstValueFrom(
        this.patientPortalService.getPacsConfiguration(study.medicalOffice.id)
      );

      const url = `${pacsConfig.viewerUrl}/patient-viewer?StudyInstanceUIDs=${study.studyInstance}`;
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch {
      this.error = 'Error al cargar el visualizador. Intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/patient-portal/studies');
  }
}
