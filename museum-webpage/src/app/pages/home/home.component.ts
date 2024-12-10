import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  content?: string;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
