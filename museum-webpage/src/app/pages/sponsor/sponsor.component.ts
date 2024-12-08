import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddService } from '../../shared/services/add.service';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { DelService } from '../../shared/services/del.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AddSponsorDialogComponent } from '../spon-add-dialog/spon-add-dialog.component';

interface Sponsor {
  name: string;
  records: {
    date: string;
    amount: number;
  }[];
}


@Component({
  selector: 'app-sponsor',
  imports: [CommonModule, MatTableModule, MatExpansionModule, MatButtonModule, FormsModule, MatInputModule],
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
})
export class SponsorComponent implements OnInit {
  exhibitionId: string | null = null;
  exhibitionName: string = '';
  sponsors: Sponsor[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private editExhService: EditExhService,
              private searchExhService: SearchExhService, private addService: AddService, private delService: DelService) {}

  ngOnInit(): void { 
    this.route.queryParams.subscribe((params) => {
      this.exhibitionId = params['exhibitionId'] || null;
    if (this.exhibitionId) {
      this.exhibitionName = params['exhName'];
      this.loadSponsors();
    } else {
      console.warn('展覽 ID 未提供');
      this.exhibitionName = '展覽資料未提供';
    }
  }); }

  loadSponsors(): void {
    this.searchExhService.getSponsorByExhId(this.exhibitionId).subscribe({
      next: (data) => {
        // 提取贊助商資料
        if (data[0].sponsors && Array.isArray(data[0].sponsors)) {
          this.sponsors = data[0].sponsors.map((sponsor: any) => ({
            name: sponsor.spon_name,
            records: sponsor.records || [],
            totalSponsorship: this.calculateTotalSponsorship(sponsor.records),
          }));
  
          // 計算總金額
        } else {
          this.sponsors = [];
          console.warn("未找到贊助商資料");
        }
  
        console.log("處理後的贊助商資料:", this.sponsors);
      },
      error: (err) => {
        console.error("無法載入贊助商資料", err);
        this.sponsors = [];
        this.exhibitionName = "載入贊助商資料時發生錯誤";
      },
    });
  }
  
  calculateTotalSponsorship(records: any[]): number {
    if (!records || !Array.isArray(records)) {
      return 0;
    }
    return records.reduce((total, record) => {
      return total + (record.amount || 0);
    }, 0);
  }

  editingIndex: number | null = null;
  editableRecord: any = null;
  originalStartTime: string | null = null;

  enableEdit(sponsorName: string, recordIndex: number): void {
    this.editingIndex = recordIndex;
    const sponsor = this.sponsors.find((s) => s.name === sponsorName);
    if (sponsor) {
      this.editableRecord = { ...sponsor.records[recordIndex] };
      this.originalStartTime = sponsor.records[recordIndex].date; // 保存原本的開始時間
    }
  }
  
  cancelEdit(): void {
    this.editingIndex = null;
    this.editableRecord = null;
    this.originalStartTime = null;
  }
  
  saveEdit(sponsorName: string, recordIndex: number): void {
    const sponsor = this.sponsors.find((s) => s.name === sponsorName);
    if (sponsor) {
      const updatedRecord = { ...this.editableRecord };
  
      // 呼叫 API 更新資料
      this.editExhService.updateSponsor(
        this.exhibitionId,
        sponsorName,
        this.originalStartTime, // 傳遞原本的開始時間作為條件
        updatedRecord
      ).subscribe(
        (response) => {
          console.log('更新成功:', response);
          sponsor.records[recordIndex] = updatedRecord; // 更新本地資料
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
  
  deleteRecord(sponName: string, recordIndex: number): void {
    const sponsor = this.sponsors.find((s) => s.name === sponName);
    if (sponsor) {
      const sponsorName = sponsor.name;
      const date = sponsor.records[recordIndex].date;
  
      // 呼叫 API 刪除資料
      this.delService.deleteSponsor(
        this.exhibitionId,
        sponsorName,
        date
      ).subscribe(
        (response) => {
          console.log('刪除成功:', response);
          sponsor.records.splice(recordIndex, 1); // 本地移除資料
          this.loadSponsors();
        },
        (error) => {
          console.error('刪除失敗:', error);
        }
      );
    }
  }  

  // 打開新增志工紀錄的彈跳視窗
  openAddSponsorDialog(): void {
    const dialogRef = this.dialog.open(AddSponsorDialogComponent, {
      data: { exh_id: this.exhibitionId }
    });

    // 當彈跳視窗關閉後
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 呼叫 API 新增志工紀錄
        this.addService.addSponsorRecord(result).subscribe(
          (data) => {
            console.log("贊助商紀錄已成功新增", data);
            this.sponsors.push(data);
            this.loadSponsors();
          },
          (err) => {
            console.error("無法新增贊助商紀錄", err);
          }
        );
      }
    });
  }
}
