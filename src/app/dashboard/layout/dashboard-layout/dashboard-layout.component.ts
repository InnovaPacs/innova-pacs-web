import { AfterViewInit, Component } from '@angular/core'; 

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.css',
    standalone: false
})
export class DashboardLayoutComponent {
  public title = 'Dashboard';
}