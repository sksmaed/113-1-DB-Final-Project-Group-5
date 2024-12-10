import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Chart, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { StatsService } from '../../shared/services/stats.service';

@Component({
  selector: 'app-analysis-tran',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, BaseChartDirective, MatOptionModule,
  MatDatepickerModule, MatSelectModule, MatInputModule],
  providers: [
    provideNativeDateAdapter(),
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './analysis-tran.component.html',
  styleUrl: './analysis-tran.component.scss'
})
export class AnalysisTranComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  chartLabels: string[] = [];
  stats = {
    todayTransactionCount: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  };

  chartData: ChartData<'bar'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: '票券售出數量',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
  chartType: ChartType = 'bar';

  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private statsService: StatsService) {
    this.searchForm = this.fb.group({
      date: [''],
      identity: [''],
      validTimeSpan: [''],
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const today = new Date().toISOString().split('T')[0]; // 取得今日日期
    const queryParams = { date: today };
    this.statsService.getTransStats(queryParams)
      .subscribe((response: any) => {
        this.stats.todayTransactionCount = response.transactionCount || 0;
        this.stats.totalTicketsSold = response.totalTicketsSold || 0;
        this.stats.totalRevenue = response.totalRevenue || 0;
        
        // 更新圖表資料
        this.chartData.labels = response.ticketTypes.map((t: any) => t.t_name);
        this.chartData.datasets[0].data = response.ticketTypes.map(
          (t: any) => parseInt(t.amount, 10)
        );
      });
    
    this.updateChart();
  }

  ngAfterViewChecked() {
    // 每次視圖檢查後，更新圖表，確保即時顯示
    this.updateChart();
  }

  updateChart() {
    if (this.chart && this.chart.chart) {
      this.chart.update();
    }
  }

  onSearch(): void {
    const filters = this.searchForm.value;
    const queryParams = new URLSearchParams(filters).toString();

    /*this.http.get(`/api/tickets/stats?${queryParams}`).subscribe((response: any) => {
      this.stats.todayTransactionCount = response.transactionCount || 0;
      this.stats.totalTicketsSold = response.totalTicketsSold || 0;
      this.stats.totalRevenue = response.totalRevenue || 0;

      // 更新圖表資料
      this.chartData.labels = response.ticketTypes.map((t: any) => t.t_name);
      this.chartData.datasets[0].data = response.ticketTypes.map(
        (t: any) => t.quantity
      );
    });*/
  }

  navigateToTransactionRecords(): void {
    // 跳轉到交易紀錄頁面
    this.router.navigate(['/tran-history']);
  }
}
