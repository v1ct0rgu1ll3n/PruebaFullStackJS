import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ChartType,
  ChartConfiguration
} from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Registrar controladores de Chart.js
Chart.register(
  BarController,
  DoughnutController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Interfaces
interface ProductItem {
  product: { name: string };
  quantity: number;
}

interface Order {
  id: number;
  customer: { name: string };
  order_date: string;
  status: string;
  payment_method: string;
  total_amount: number;
  items?: ProductItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, RouterModule, FormsModule, CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Filtros
  startDate = '';
  endDate = '';

  // KPIs
  totalSales = 0;
  totalOrders = 0;
  avgTicket = 0;

  // Ventas por día
  salesLabels: string[] = [];
  salesData: number[] = [];
  salesChartType: ChartType = 'bar';
  salesChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } }
  };

  // Top productos
  topProductsLabels: string[] = [];
  topProductsData: number[] = [];
  topProductsChartType: ChartType = 'bar';
  topProductsChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  // Métodos de pago
  paymentLabels: string[] = [];
  paymentData: number[] = [];
  paymentChartType: ChartType = 'doughnut';
  paymentChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  private allOrders: Order[] = []; // Guardamos todos los datos para los gráficos

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.api.getOrders().subscribe((res: { data: Order[] }) => {
      this.allOrders = res.data; // Guardamos los datos completos

      // Inicializar gráficos con datos generales
      this.updateCharts(this.allOrders);

      // Inicializar KPIs con los filtros actuales
      this.updateKPIs();
    });
  }

  // Calcula solo los KPIs según filtros
  updateKPIs() {
    let filteredOrders = [...this.allOrders];

    // Función para normalizar a solo año-mes-día
    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const start = this.startDate ? normalizeDate(new Date(this.startDate)) : null;
    const end = this.endDate ? normalizeDate(new Date(this.endDate)) : null;

    filteredOrders = filteredOrders.filter(o => {
      const orderDate = normalizeDate(new Date(o.order_date));
      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    this.totalSales = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    this.totalOrders = filteredOrders.length;
    this.avgTicket = this.totalOrders ? this.totalSales / this.totalOrders : 0;
  }


  // Calcula los datos de gráficos con todos los datos (sin filtros)
  updateCharts(orders: Order[]) {
    // Top 5 productos
    const productMap: Record<string, number> = {};
    orders.forEach(o => {
      if (o.items && o.items.length) {
        o.items.forEach(i => {
          const name = i?.product?.name;
          const qty = i?.quantity || 0;
          if (name) productMap[name] = (productMap[name] || 0) + qty;
        });
      }
    });

    const sortedProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.topProductsLabels = sortedProducts.map(p => p[0]);
    this.topProductsData = sortedProducts.map(p => p[1]);
    this.topProductsChartData = { labels: this.topProductsLabels, datasets: [{ data: this.topProductsData, label: 'Cantidad' }] };

    // Ventas por día
    const grouped: Record<string, number> = {};
    orders.forEach(o => {
      const date = new Date(o.order_date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + Number(o.total_amount || 0);
    });
    this.salesLabels = Object.keys(grouped);
    this.salesData = Object.values(grouped);
    this.salesChartData = { labels: this.salesLabels, datasets: [{ data: this.salesData, label: 'Ventas' }] };

    // Métodos de pago
    const paymentMap: Record<string, number> = {};
    orders.forEach(o => {
      if (o.payment_method) paymentMap[o.payment_method] = (paymentMap[o.payment_method] || 0) + 1;
    });
    this.paymentLabels = Object.keys(paymentMap);
    this.paymentData = Object.values(paymentMap);
    this.paymentChartData = { labels: this.paymentLabels, datasets: [{ data: this.paymentData }] };
  }


  applyFilters() {
    this.updateKPIs(); // Solo recalcular KPIs según los filtros
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
