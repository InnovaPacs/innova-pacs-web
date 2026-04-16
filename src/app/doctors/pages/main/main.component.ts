import { Component, inject } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../interfaces/doctor.interface';
import { Item, Pagination } from '../../../shared/interfaces/pagination.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    standalone: false
})
export class MainComponent {
  private service = inject(DoctorService);
  domains: Doctor[] = [];

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  private fb = inject(FormBuilder);


  public form: FormGroup = this.fb.group({
    mainSearch: [null]
  });

  constructor() { }

  ngOnInit(): void {
    this.getAllData(0, null);
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
    this.getAllData(page, null);
  }

  private getAllData(page: number, mainSearch: string | null) {
    this.service.getAll(page, mainSearch).subscribe((response) => {
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

  onSubmit(): void {
    const mainSearch = this.form.get('mainSearch')?.value;
    this.getAllData(0, mainSearch);
  }
}
