import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'sku', 'price', 'category'];
  total = 0;
  page = 1;
  pageSize = 10;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.api.getProducts(this.page, this.pageSize).subscribe(res => {
      this.products = res.data;
      this.total = res.meta.total;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadProducts();
  }
}
