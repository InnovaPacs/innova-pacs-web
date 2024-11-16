import { Component, inject } from '@angular/core';
import { MedicalOfficeService } from '../../services/medilca-office.service';
import { MedicalOffice } from '../../interfaces/medical-office.interface';
import { Item, Pagination } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private medicalOfficeService = inject(MedicalOfficeService);
  medicalOffices: MedicalOffice[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { }

  ngOnInit(): void {
    console.log('GET DATA OF ');
    this.getAllData(0);
  }

  getItems(totalPages: number):Item[] {
    let items = [];

    for (let i = 0; i < totalPages; i++) {
      const item = {
        'name': `${i + 1}`,
        'index': i
      }

      items.push(item);
    }
    return items;
  }

  navigate(page: number):void {
    this.getAllData(page);
  }

  private getAllData(page: number) {
    this.medicalOfficeService.getAllByUserId(null ,page).subscribe((response) => {
      console.log('response: ', response.content);
      this.medicalOffices = response.content;
      
      this.pagination = {
        currentPage: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        items: this.getItems(response.totalPages)
      }
    });
  }

  onCardClick() {
    console.log("----------");
  }
}
