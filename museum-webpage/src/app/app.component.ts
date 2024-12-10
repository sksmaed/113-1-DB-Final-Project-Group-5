// app.component.ts
import { Component } from '@angular/core';
import { TokenStorageService } from './shared/services/token-storage.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RouterLink, CommonModule],
  standalone: true
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false; //用來記錄是否已登入系統的變數
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();  // 若在 session storage 中有有效的 token 則表示已有正常的登入系統

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.s_id;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut(); //清除 session storage
    location.reload();
  }
}
