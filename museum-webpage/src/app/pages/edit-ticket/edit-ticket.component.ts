import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { MatDialog } from '@angular/material/dialog';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditTicketDialogComponent } from '../edit-ticket-dialog/edit-ticket-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-ticket',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, 
    MatButtonModule, MatTableModule, MatOptionModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.scss']
})
export class EditTicketComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    valid_time_span: new FormControl(''),
    exhName: new FormControl(''),
    building: new FormControl(''),
    identity: new FormControl(''),
  });
  tickets: any[] = [];
  displayedColumns: string[] = ['t_name', 'price', 'sale_start_date', 'sale_end_date', 'valid_time_span',
   'identity', 'exhibitions', 'actions'];

  // 用 Map 管理每個 ticket 的展示狀態
  showRoomsMap = new Map<string, boolean>();

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

  constructor(private fb: FormBuilder, private searchExhService: SearchExhService, private router: Router,
    private dialog: MatDialog, private editService: EditExhService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { }

  onSearch(): void {
    const params = this.searchForm.value;
    console.log('Search Params:', params);
    this.searchExhService.getTicketAdmin(params).subscribe((data) => {
      console.log(data);
      this.tickets = data;
    });
  }

  // 切換展覽顯示狀態
  toggleRooms(ticket: any): void {
    // 切換該 ticket 的展覽顯示狀態
    const currentState = this.showRoomsMap.get(ticket.t_id) || false;
    this.showRoomsMap.set(ticket.t_id, !currentState);
  }

  // 根據 t_id 獲取該 ticket 是否顯示展覽
  getExhibitionsVisibility(ticketId: string): boolean {
    return this.showRoomsMap.get(ticketId) || false;
  }

  editTicket(ticket: any): void {
    const dialogRef = this.dialog.open(EditTicketDialogComponent, {
      width: '800px',
      data: ticket, // 傳入相關票務資料
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTicket(result);
      }
    });
  }

  navigateToAddTicket(): void {
    this.router.navigate(['/add-ticket']);
  }

  updateTicket(data: any): void {
    // 調用後端 API 保存交易
    console.log(data);
    this.editService.updateTicket(data).subscribe(
      response => {
        console.log('更新展覽票券成功', response);
        this.snackBar.open('更新展覽票券成功', '確定', { duration: 3000 });
      },
      err => {
        console.error('更新展覽票券失敗', err);
        this.snackBar.open('更新展覽票券失敗', '關閉', { duration: 3000 });
      }
    );
  }
}
