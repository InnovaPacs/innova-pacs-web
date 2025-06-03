import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'innova-pacs';

  ngAfterViewInit(): void {
    (window as any).flatpickr('.datetimepicker', {});
  }
}
