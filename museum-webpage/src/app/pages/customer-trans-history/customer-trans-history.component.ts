import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SearchExhService } from '../../shared/services/search-exh.service';

@Component({
  selector: 'app-customer-trans-history',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatTableModule, FormsModule],
  templateUrl: './customer-trans-history.component.html',
  styleUrl: './customer-trans-history.component.scss'
})
export class CustomerTransHistoryComponent {
  c_phone: string = '';
  transactionRecords: any[] = [];
  displayedColumns: string[] = ['t_name', 'date', 'amount', 'totalCost', 'payment_method'];

  paymentMethodMap: { [key: string]: string } = {
    credit_card: '信用卡',
    linepay: 'LinePay',
    bank_transfer: '銀行轉帳'
  };

  constructor(private router: Router, private searchService: SearchExhService) {}

  searchRecords() {
    if (!this.c_phone.trim()) {
      alert('請輸入手機號碼');
      return;
    }
    const query = {c_phone: this.c_phone};
    this.searchService.getTransactionCustomer(query)
      .subscribe({
        next: (data: any) => {
          this.transactionRecords = data;
        },
        error: (err) => {
          console.error('查詢失敗', err);
          alert('查詢失敗，請稍後再試');
        },
      });
  }

  getPaymentMethodName(method: string): string {
    return this.paymentMethodMap[method];
  }
}
