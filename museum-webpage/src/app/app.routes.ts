import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BoardAdminComponent } from './pages/board-admin/board-admin.component';
import { SearchExhComponent } from './pages/search-exh/search-exh.component';
import { ExhibitionManagementComponent } from './pages/edit-exh/edit-exh.component';
import { VolunteerComponent } from './pages/volunteer/volunteer.component';
import { SponsorComponent } from './pages/sponsor/sponsor.component';
import { StaffDutyComponent } from './pages/staff-duty/staff-duty.component';
import { AddExhibitionComponent } from './pages/add-exhibition/add-exhibition.component';
import { SearchTicketComponent } from './pages/search-ticket/search-ticket.component';
import { EditTicketComponent } from './pages/edit-ticket/edit-ticket.component';
import { AddTicketComponent } from './pages/add-ticket/add-ticket.component';
import { AnalysisTranComponent } from './pages/analysis-tran/analysis-tran.component';
import { ViewTranComponent } from './pages/view-tran/view-tran.component';
import { CustomerTransHistoryComponent } from './pages/customer-trans-history/customer-trans-history.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "profile", component: ProfileComponent },
    { path: "admin", component: BoardAdminComponent },
    { path: "search-exh", component: SearchExhComponent },
    { path: "edit-exh", component: ExhibitionManagementComponent },
    { path: "volunteer", component: VolunteerComponent },
    { path: "sponsor", component: SponsorComponent },
    { path: "staff-duty", component: StaffDutyComponent },
    { path: "add-exh", component: AddExhibitionComponent },
    { path: "search-ticket", component: SearchTicketComponent },
    { path: "edit-ticket", component: EditTicketComponent },
    { path: "add-ticket", component:  AddTicketComponent},
    { path: "analysis-tran", component:  AnalysisTranComponent},
    { path: "view-tran", component:  ViewTranComponent},
    { path: "customer-trans-history", component:  CustomerTransHistoryComponent},
];
