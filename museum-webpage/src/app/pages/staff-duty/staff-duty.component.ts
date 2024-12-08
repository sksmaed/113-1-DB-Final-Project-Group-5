import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AddStaffDutyDialogComponent } from '../staff-duty-add-dialog/staff-duty-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddService } from '../../shared/services/add.service';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { DelService } from '../../shared/services/del.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

interface Staff {
  id: string;
  name: string;
  records: {
    duty: string;
  }[];
}


@Component({
  selector: 'app-staff-duty',
  imports: [CommonModule, MatTableModule, MatExpansionModule, MatButtonModule, FormsModule, MatInputModule],
  templateUrl: './staff-duty.component.html',
  styleUrls: ['./staff-duty.component.scss'],
})
export class StaffDutyComponent implements OnInit {
  exhibitionId: string | null = null;
  exhibitionName: string = '';
  staffs: Staff[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private editExhService: EditExhService,
              private searchExhService: SearchExhService, private addService: AddService, private delService: DelService) {}

  ngOnInit(): void { 
    this.route.queryParams.subscribe((params) => {
      this.exhibitionId = params['exhibitionId'] || null;
    if (this.exhibitionId) {
      this.exhibitionName = params['exhName'];
      this.loadStaffs();
    } else {
      console.warn('展覽 ID 未提供');
      this.exhibitionName = '展覽資料未提供';
    }
  }); }

  loadStaffs(): void {
    this.searchExhService.getStaffByExhId(this.exhibitionId).subscribe({
      next: (data) => {
        if (data[0].staffs && Array.isArray(data[0].staffs)) {
          this.staffs = data[0].staffs.map((staff: any) => ({
            id: staff.s_id,
            name: staff.s_name,
            records: staff.records.map((record: any) => ({
              duty: record.duty,
            })),
          }));
        } else {
          this.staffs = [];
          console.warn("未找到職員資料");
        }
  
        console.log("處理後的職員資料:", this.staffs);
      },
      error: (err) => {
        console.error("無法載入職員資料", err);
        this.staffs = [];
        this.exhibitionName = "載入職員資料時發生錯誤";
      },
    });
  }

  editingIndex: number | null = null;
  editableRecord: any = null;

  enableEdit(staffId: string, recordIndex: number): void {
    this.editingIndex = recordIndex;
    const staff = this.staffs.find((s) => s.id === staffId);
    if (staff) {
      this.editableRecord = { ...staff.records[recordIndex] };
    }
  }
  
  cancelEdit(): void {
    this.editingIndex = null;
    this.editableRecord = null;
  }
  
  saveEdit(staffId: string, recordIndex: number): void {
    const staff = this.staffs.find((s) => s.id === staffId);
    if (staff) {
      const updatedRecord = { ...this.editableRecord };

      // 呼叫 API 更新資料
      this.editExhService.updateStaffDuty(
        this.exhibitionId,
        staffId,
        updatedRecord
      ).subscribe(
        (response) => {
          console.log('更新成功:', response);
          staff.records[recordIndex] = updatedRecord; // 更新本地資料
          this.editingIndex = null;
          this.editableRecord = null;
        },
        (error) => {
          console.error('更新失敗:', error);
        }
      );
    }
  }
  
  deleteRecord(staffId: string, recordIndex: number): void {
    const staff = this.staffs.find((v) => v.id === staffId);
    if (staff) {
      const staffId = staff.id;
  
      // 呼叫 API 刪除資料
      this.delService.deleteStaffDuty(
        this.exhibitionId,
        staffId,
      ).subscribe(
        (response) => {
          console.log('刪除成功:', response);
          staff.records.splice(recordIndex, 1); // 本地移除資料
        },
        (error) => {
          console.error('刪除失敗:', error);
        }
      );
    }
  }  

  // 打開新增志工紀錄的彈跳視窗
  openAddStaffDialog(): void {
    const dialogRef = this.dialog.open(AddStaffDutyDialogComponent, {
      data: { exh_id: this.exhibitionId }
    });

    // 當彈跳視窗關閉後
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 呼叫 API 新增志工紀錄
        this.addService.addStaffDutyRecord(result).subscribe(
          (data) => {
            console.log("職員紀錄已成功新增", data);
            this.staffs.push(data);
            this.loadStaffs();
          },
          (err) => {
            console.error("無法新增職員紀錄", err);
          }
        );
      }
    });
  }
}
