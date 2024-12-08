import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BoardUserComponent } from './pages/board-user/board-user.component';
import { BoardAdminComponent } from './pages/board-admin/board-admin.component';
import { SearchExhComponent } from './pages/search-exh/search-exh.component';
import { ExhibitionManagementComponent } from './pages/edit-exh/edit-exh.component';
import { VolunteerComponent } from './pages/volunteer/volunteer.component';
import { SponsorComponent } from './pages/sponsor/sponsor.component';
import { StaffDutyComponent } from './pages/staff-duty/staff-duty.component';
import { AddExhibitionComponent } from './pages/add-exhibition/add-exhibition.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent },
    { path: "user", component: BoardUserComponent },
    { path: "admin", component: BoardAdminComponent },
    { path: "search", component: SearchExhComponent },
    { path: "edit-exh", component: ExhibitionManagementComponent },
    { path: "volunteer", component: VolunteerComponent },
    { path: "sponsor", component: SponsorComponent },
    { path: "staff-duty", component: StaffDutyComponent },
    { path: "add-exh", component: AddExhibitionComponent },
];
