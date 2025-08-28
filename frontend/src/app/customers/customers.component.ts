import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  displayedColumns: string[] = ['id', 'name', 'email', 'created_at'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.api.getCustomers(this.page, this.pageSize).subscribe(res => {
      this.customers = res.data;
      this.total = res.meta.total;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadCustomers();
  }
}
