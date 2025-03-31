import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzTableModule} from 'ng-zorro-antd/table';
import {HttpClientModule} from '@angular/common/http';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzInputModule} from 'ng-zorro-antd/input';
import {CommonModule} from '@angular/common';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule ,RouterOutlet, HeaderComponent, NzIconModule, NzLayoutModule, NzMenuModule, NzTableModule, NzRadioModule, NzTabsModule, NzDropDownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Reto tecnico - Frontend';
}
