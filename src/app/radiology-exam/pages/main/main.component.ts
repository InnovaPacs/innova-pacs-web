import { Component, inject } from '@angular/core';
import { Pagination, Item } from '../../../shared/interfaces/pagination.interface';
import { RadiolodyExam } from '../../interfaces/radiology-exam.interface';
import { RadiologyExamService } from '../../services/radiology-exam.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private service = inject(RadiologyExamService);
  private route = inject(ActivatedRoute);
  domains: RadiolodyExam[] = [];
  public appointmentId!: string;

  pagination: Pagination = {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    items: []
  }

  constructor() { 
    console.log('MainRadiologyExamComponent');
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => params.get('appointmentId')),
      catchError(error => {
        return EMPTY;
      })
    ).subscribe(appointmentId => {
      this.appointmentId = appointmentId!;
      this.getAllData(appointmentId!, 0);
    });
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
    this.getAllData(this.appointmentId!, page);
  }

  private getAllData(appointmentId: string, page: number) {
    this.service.getAll(appointmentId, page).subscribe((response) => {
      console.log('response: ', response.content);
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
