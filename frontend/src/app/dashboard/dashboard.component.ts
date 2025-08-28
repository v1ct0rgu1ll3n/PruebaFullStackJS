import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

// Importaciones de Chart.js y ng2-charts v8
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  salesData: number[] = [];
  salesLabels: string[] = [];

  // Configuración del gráfico
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.salesLabels,
    datasets: [
      { data: this.salesData, label: 'Ventas' }
    ]
  };

  public barChartType: ChartType = 'bar';

  constructor(
    private api: ApiService,
    private router: Router) { }

  ngOnInit(): void {
  this.api.getOrders().subscribe(res => {
    // Agrupar ventas por fecha
    const grouped: Record<string, number> = {};
    res.data.forEach((o: any) => {
      const date = new Date(o.order_date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + o.total_amount;
    });

    this.salesLabels = Object.keys(grouped);
    this.salesData = Object.values(grouped);

    this.barChartData = {
      labels: this.salesLabels,
      datasets: [
        { data: this.salesData, label: 'Ventas' }
      ]
    };
  });
}



  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
