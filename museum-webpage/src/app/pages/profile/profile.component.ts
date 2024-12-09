import { Component, OnInit } from '@angular/core';
import { EditExhService } from '../../shared/services/edit-exh.service';
import { SearchExhService } from '../../shared/services/search-exh.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../shared/services/token-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;  // 存放目前登入的使用者資料
  staff: any;        // 存放職員資料
  isEditing: boolean = false;  // 判斷是否在編輯模式

  constructor(private token: TokenStorageService, private searchExhService: SearchExhService,
     private editExhService: EditExhService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    console.log(this.currentUser);
    this.getStaffData();
  }

  getStaffData(): void {
    this.searchExhService.getStaffById(this.currentUser.id).subscribe((data) => {
      this.staff = data;
    });
  }

  // 開啟編輯模式
  editStaff(): void {
    this.isEditing = true;
  }

  // 取消編輯模式
  cancelEdit(): void {
    this.isEditing = false;
    this.getStaffData();  // 重新獲取資料，取消編輯
  }

  // 儲存職員編輯資料
  saveStaff(): void {
    this.editExhService.updateStaff(this.currentUser.id, this.staff).subscribe(
      (response) => {
        this.isEditing = false;
        this.getStaffData();  // 更新顯示資料
        this.snackBar.open('資料已儲存', '確定', { duration: 3000 });
      },
      (error) => {
        console.error('儲存錯誤', error);
        this.snackBar.open('儲存錯誤', '確定', { duration: 3000 });
      }
    );
  }
}
