import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Item, Pagination } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  private userService = inject(UserService);
  users: User[] = [];

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
    console.log(page);
    this.getAllData(page);
  }

  private getAllData(page: number) {
    this.userService.getAll(page).subscribe((response) => {
      this.users = response.content;
      
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
