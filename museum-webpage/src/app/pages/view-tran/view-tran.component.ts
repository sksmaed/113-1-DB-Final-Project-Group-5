import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from 'express';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-tran',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatOptionModule,
    MatDatepickerModule, MatSelectModule, MatInputModule, MatTableModule],
    providers: [
      provideNativeDateAdapter()
    ],
  templateUrl: './view-tran.component.html',
  styleUrl: './view-tran.component.scss'
})
export class ViewTranComponent {
  searchForm: FormGroup;
  transactionRecords = [];
  displayedColumns: string[] = ['tran_id', 'c_id', 'date', 'payment_method', 't_name', 'amount'];

  constructor(private fb: FormBuilder, private router: Router, private searchExhService: SearchExhService) {
    this.searchForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      ticketName: [''],
      identity: [''],
      validTimeSpan: ['']
    });
  }

  onSearch() {
    const params = this.searchForm.value;
    this.searchExhService.getTransaction(params)
      .subscribe((response: any) => {
        this.transactionRecords = response;
      });
  }
}
