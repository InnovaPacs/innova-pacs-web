import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'fileUrl',
    standalone: false
})
export class FileUrlPipe implements PipeTransform {
  private readonly filesBaseUrl = `${environment.baseUrl}/api/files`;

  transform(fileId: string | null | undefined, fallback: string): string {
    return fileId ? `${this.filesBaseUrl}/${fileId}` : fallback;
  }
}
