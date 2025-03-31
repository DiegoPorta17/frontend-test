import { Component } from '@angular/core';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NzLayoutModule,
    NzAvatarModule,
    NzBadgeModule,
    NzIconModule,
    CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  username = 'Administrador';
  activeSection = 'organization';

  navigateToSection(section: string): void {
    this.activeSection = section;
  }
}
