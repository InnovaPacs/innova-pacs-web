import { Component, inject } from '@angular/core';
import { PacsConfigurationService } from '../../service/pacs-configuration.service';
import { PacsConfiguration } from '../../interfaces/pacs-configuration.interface';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private service = inject(PacsConfigurationService);
  domains: PacsConfiguration[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { }

  ngOnInit(): void {
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
    this.service.getAll(page).subscribe((response) => {
      this.domains = response.content;
      
      this.pagination = {
        currentPage: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        items: this.getItems(response.totalPages)
      }
    });
  }
}

