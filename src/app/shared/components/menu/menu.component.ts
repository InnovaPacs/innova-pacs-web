import { AfterViewInit, Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit {
  
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
