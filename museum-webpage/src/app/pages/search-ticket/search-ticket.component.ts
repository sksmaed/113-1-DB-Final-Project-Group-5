import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { BuyTicketDialogComponent } from '../buy-ticket-dialog/buy-ticket-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddService } from '../../shared/services/add.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-purchase',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, 
    MatButtonModule, MatTableModule, MatOptionModule, MatInputModule, MatSelectModule],
  templateUrl: './search-ticket.component.html',
  styleUrls: ['./search-ticket.component.scss']
})
export class SearchTicketComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    valid_time_span: new FormControl(''),
    exhName: new FormControl(''),
    building: new FormControl(''),
    identity: new FormControl(''),
  });
  tickets: any[] = [];
  displayedColumns: string[] = ['t_name', 'price', 'identity', 'exhibitions', 'actions'];

  // 用 Map 管理每個 ticket 的展示狀態
  showExhibitionsMap = new Map<string, boolean>();

  identityMapping: any = {
    'A': '成人',
    'S': '學生',
    'C': '幼童',
    'O': '年長者',
    'D': '行動不便者'
  };
  
  // 映射函數
  getIdentityLabel(idenCode: string): string {
    return this.identityMapping[idenCode] || '不限'; // 如果沒有對應值，顯示 '不限'
  }

  constructor(private fb: FormBuilder, private searchExhService: SearchExhService,
    private dialog: MatDialog, private addService: AddService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { }

  onSearch(): void {
    const params = this.searchForm.value;
    console.log('Search Params:', params);
    this.searchExhService.getTicket(params).subscribe((data) => {
      console.log(data);
      this.tickets = data;
    });
  }

  // 切換展覽顯示狀態
  toggleExhibitions(ticket: any): void {
    // 切換該 ticket 的展覽顯示狀態
    const currentState = this.showExhibitionsMap.get(ticket.t_id) || false;
    this.showExhibitionsMap.set(ticket.t_id, !currentState);
  }

  // 根據 t_id 獲取該 ticket 是否顯示展覽
  getExhibitionsVisibility(ticketId: string): boolean {
    return this.showExhibitionsMap.get(ticketId) || false;
  }

  buyTicket(ticket: any): void {
    const dialogRef = this.dialog.open(BuyTicketDialogComponent, {
      width: '800px',
      data: ticket, // 傳入相關票務資料
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processPurchase(result);
      }
    });
  }

  processPurchase(purchaseData: any): void {
    // 調用後端 API 保存交易
    console.log(purchaseData);
    this.addService.addTransaction(purchaseData).subscribe(
      response => {
        console.log('交易成功', response);
        this.snackBar.open('交易成功', '確定', { duration: 3000 });
      },
      err => {
        console.error('交易失敗', err);
        this.snackBar.open('交易失敗', '關閉', { duration: 3000 });
      }
    );
  }
}
