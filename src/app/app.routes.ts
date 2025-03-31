import { Routes } from '@angular/router';
import {OrganizationComponent} from './components/organization/organization.component';

export const routes: Routes = [
  { path: '', redirectTo: '/divisions', pathMatch: 'full' },
  { path: 'divisions', component: OrganizationComponent }];
