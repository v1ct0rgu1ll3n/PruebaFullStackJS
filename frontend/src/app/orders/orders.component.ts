import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['id', 'customer', 'order_date', 'status', 'payment_method', 'total_amount'];
  total = 0;
  page = 1;
  pageSize = 10;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.api.getOrders(this.page, this.pageSize).subscribe(res => {
      this.orders = res.data;
      this.total = res.meta.total;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadOrders();
  }
}
