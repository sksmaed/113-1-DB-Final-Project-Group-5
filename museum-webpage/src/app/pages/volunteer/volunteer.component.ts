import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AddVolunteerDialogComponent } from '../vol-add-dialog/vol-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddService } from '../../shared/services/add.service';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { DelService } from '../../shared/services/del.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

interface Volunteer {
  id: string;
  name: string;
  records: {
    start_time: string;
    end_time: string;
    duty: string;
  }[];
}


@Component({
  selector: 'app-volunteer',
  imports: [CommonModule, MatTableModule, MatExpansionModule, MatButtonModule, FormsModule, MatInputModule],
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
})
export class VolunteerComponent implements OnInit {
  exhibitionId: string | null = null;
  exhibitionName: string = '';
  volunteers: Volunteer[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private editExhService: EditExhService,
              private searchExhService: SearchExhService, private addService: AddService, private delService: DelService) {}

  ngOnInit(): void { 
    this.route.queryParams.subscribe((params) => {
      this.exhibitionId = params['exhibitionId'] || null;
    if (this.exhibitionId) {
      this.exhibitionName = params['exhName'];
      this.loadVolunteers();
    } else {
      console.warn('展覽 ID 未提供');
      this.exhibitionName = '展覽資料未提供';
    }
  }); }

  loadVolunteers(): void {
    this.searchExhService.getVolunteerByExhId(this.exhibitionId).subscribe({
      next: (data) => {
        // 提取志工資料
        if (data[0].volunteers && Array.isArray(data[0].volunteers)) {
          this.volunteers = data[0].volunteers.map((volunteer: any) => ({
            id: volunteer.v_id,
            name: volunteer.v_name,
            records: volunteer.records.map((record: any) => ({
              start_time: record.start_time,
              end_time: record.end_time,
              duty: record.duty,
            })),
          }));
        } else {
          this.volunteers = [];
          console.warn("未找到志工資料");
        }
  
        console.log("處理後的志工資料:", this.volunteers);
      },
      error: (err) => {
        console.error("無法載入志工資料", err);
        this.volunteers = [];
        this.exhibitionName = "載入志工資料時發生錯誤";
      },
    });
  }

  editingIndex: number | null = null;
  editableRecord: any = null;
  originalStartTime: string | null = null;

  enableEdit(volunteerId: string, recordIndex: number): void {
    this.editingIndex = recordIndex;
    const volunteer = this.volunteers.find((v) => v.id === volunteerId);
    if (volunteer) {
      this.editableRecord = { ...volunteer.records[recordIndex] };
      this.originalStartTime = volunteer.records[recordIndex].start_time; // 保存原本的開始時間
    }
  }
  
  cancelEdit(): void {
    this.editingIndex = null;
    this.editableRecord = null;
    this.originalStartTime = null;
  }
  
  saveEdit(volunteerId: string, recordIndex: number): void {
    const volunteer = this.volunteers.find((v) => v.id === volunteerId);
    if (volunteer) {
      const updatedRecord = { ...this.editableRecord };
  
      // 呼叫 API 更新資料
      this.editExhService.updateVolunteer(
        this.exhibitionId,
        volunteerId,
        this.originalStartTime, // 傳遞原本的開始時間作為條件
        updatedRecord
      ).subscribe(
        (response) => {
          console.log('更新成功:', response);
          volunteer.records[recordIndex] = updatedRecord; // 更新本地資料
          this.editingIndex = null;
          this.editableRecord = null;
          this.originalStartTime = null;
        },
        (error) => {
          console.error('更新失敗:', error);
        }
      );
    }
  }
  
  deleteRecord(volunteerId: string, recordIndex: number): void {
    const volunteer = this.volunteers.find((v) => v.id === volunteerId);
    if (volunteer) {
      const volunteerId = volunteer.id;
      const startTime = volunteer.records[recordIndex].start_time;
  
      // 呼叫 API 刪除資料
      this.delService.deleteVolunteer(
        this.exhibitionId,
        volunteerId,
        startTime
      ).subscribe(
        (response) => {
          console.log('刪除成功:', response);
          volunteer.records.splice(recordIndex, 1); // 本地移除資料
        },
        (error) => {
          console.error('刪除失敗:', error);
        }
      );
    }
  }  

  // 打開新增志工紀錄的彈跳視窗
  openAddVolunteerDialog(): void {
    const dialogRef = this.dialog.open(AddVolunteerDialogComponent, {
      data: { exh_id: this.exhibitionId }
    });

    // 當彈跳視窗關閉後
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 呼叫 API 新增志工紀錄
        this.addService.addVolunteerRecord(result).subscribe(
          (data) => {
            console.log("志工紀錄已成功新增", data);
            this.volunteers.push(data);
            this.loadVolunteers();
          },
          (err) => {
            console.error("無法新增志工紀錄", err);
          }
        );
      }
    });
  }
}
