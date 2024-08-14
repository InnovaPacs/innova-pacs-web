import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit {
  private authService = inject(AuthService);

  logOut() {
    this.authService.logOut();
  }
  
  ngAfterViewInit(): void {
    $("#sidebarCollapse, #headerCollapse").on("click", function () {
      $("#main-wrapper").toggleClass("mini-sidebar");
      $("#main-wrapper").toggleClass("show-sidebar");
  
      if ($("#main-wrapper").hasClass("mini-sidebar")) {
        $("#sidebartoggler").prop("checked", true);
        $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
      } else {
        $("#sidebartoggler").prop("checked", false);
        $("#main-wrapper").attr("data-sidebartype", "full");
      }
    });
  }
}
