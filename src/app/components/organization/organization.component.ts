import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Division } from '../../models/division.model';
import { DivisionService } from '../../services/devision.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CreateDivisionComponent } from '../create-division/create-division.component';
import { CommonModule } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {NzDropdownMenuComponent, NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {NzMenuModule} from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzTabsModule,
    NzTableModule,
    NzSelectModule,
    NzModalModule,
    NzFormModule,
    NzPaginationModule,
    CommonModule,
    NzCheckboxModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzSpinModule,
    NzMenuModule,
    CreateDivisionComponent,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnInit {
  @ViewChild('menu') menu!: NzDropdownMenuComponent;

  divisions: Division[] = [];
  filteredDivisions: Division[] = [];
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  searchValue = '';
  activeView = 'list';
  isCreateModalVisible = false;
  isLoading = false;

  filterOptions: Record<string, string[]> = {
    name: [],
    parentDivision: [],
    collaborators: [],
    level: [],
    subdivisions: [],
    ambassador: []
  };
  columnsConfig = [
    { key: 'division', title: 'División' },
    { key: 'superiorDivision', title: 'División superior' },
    { key: 'collaborators', title: 'Colaboradores' },
    { key: 'level', title: 'Nivel' },
    { key: 'subdivisions', title: 'Subdivisiones' },
    { key: 'ambassadors', title: 'Embajadores' }
  ];
  selectedFilters: Record<string, string[]> = {
    name: [],
    parentDivision: [],
    collaborators: [],
    level: [],
    subdivisions: [],
    ambassador: []
  };

  filters = {
    name: { visible: false },
    parentDivision: { visible: false },
    collaborators: { visible: false },
    level: { visible: false },
    subdivisions: { visible: false },
    ambassador: { visible: false }
  };

  sortField: string | null = null;
  sortDirection: 'ascend' | 'descend' | null = null;

  visibleColumns = {
    division: true,
    superiorDivision: true,
    collaborators: true,
    level: true,
    subdivisions: true,
    ambassadors: true
  };

  constructor(private divisionService: DivisionService) {}

  ngOnInit(): void {
    this.loadDivisions();
  }

  loadDivisions(): void {
    this.isLoading = true;
    this.divisionService.getDivisions().subscribe(data => {
      this.divisions = data;
      this.filteredDivisions = [...this.divisions];
      this.total = this.divisions.length;
      this.isLoading = false;

      this.initializeFilterOptions();
    });
  }

  initializeFilterOptions(): void {
    this.filterOptions['name'] = [...new Set(this.divisions.map(d => d.name))];
    this.filterOptions['parentDivision'] = [...new Set(this.divisions
      .filter(d => d.parentDivision?.name)
      .map(d => d.parentDivision!.name))];
    this.filterOptions['collaborators'] = [...new Set(this.divisions
      .map(d => d.collaboratorsCount.toString()))];
    this.filterOptions['level'] = [...new Set(this.divisions
      .map(d => d.level.toString()))];
    this.filterOptions['subdivisions'] = [...new Set(this.divisions
      .map(d => d.subdivisionsCount!.toString()))];
    this.filterOptions['ambassador'] = [...new Set(this.divisions
      .filter(d => d.ambassadorName)
      .map(d => d.ambassadorName!))];
  }

  toggleFilterDropdown(field: string): void {
    Object.keys(this.filters).forEach(key => {
      if (key !== field) {
        this.filters[key as keyof typeof this.filters].visible = false;
      }
    });

    this.filters[field as keyof typeof this.filters].visible =
      !this.filters[field as keyof typeof this.filters].visible;
  }

  applyFilter(field: string): void {
    this.filters[field as keyof typeof this.filters].visible = false;
    this.filterDivisions();
  }

  resetFilter(field: string): void {
    this.selectedFilters[field] = [];
    this.filterDivisions();
  }

  toggleFilterOption(field: string, value: string): void {
    const index = this.selectedFilters[field].indexOf(value);
    if (index === -1) {
      this.selectedFilters[field].push(value);
    } else {
      this.selectedFilters[field].splice(index, 1);
    }
  }

  isFilterOptionSelected(field: string, value: string): boolean {
    return this.selectedFilters[field].includes(value);
  }

  resetAllFilters(): void {
    Object.keys(this.selectedFilters).forEach(key => {
      this.selectedFilters[key as keyof typeof this.selectedFilters] = [];
    });
    this.filterDivisions();
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some(values => values.length > 0);
  }

  filterDivisions(): void {
    let result = [...this.divisions];

    if (this.searchValue) {
      const searchLower = this.searchValue.toLowerCase();
      result = result.filter(div => {
        return div.name.toLowerCase().includes(searchLower) ||
          (div.parentDivision?.name && div.parentDivision.name.toLowerCase().includes(searchLower)) ||
          (div.ambassadorName && div.ambassadorName.toLowerCase().includes(searchLower));
      });
    }

    Object.keys(this.selectedFilters).forEach(field => {
      const selectedValues = this.selectedFilters[field as keyof typeof this.selectedFilters];
      if (selectedValues.length > 0) {
        result = result.filter(div => {
          const fieldValue = this.getFieldValue(div, field);
          if (fieldValue === null) return false;
          return selectedValues.includes(String(fieldValue));
        });
      }
    });

    if (this.sortField && this.sortDirection) {
      result = this.sortData(result, this.sortField, this.sortDirection);
    }

    this.filteredDivisions = result;
    this.total = result.length;
  }

  sortData(data: Division[], field: string, direction: 'ascend' | 'descend'): Division[] {
    return [...data].sort((a, b) => {
      const valueA = this.getFieldValue(a, field);
      const valueB = this.getFieldValue(b, field);

      if (valueA === null) return direction === 'ascend' ? 1 : -1;
      if (valueB === null) return direction === 'ascend' ? -1 : 1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'ascend' ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();

      if (strA < strB) return direction === 'ascend' ? -1 : 1;
      if (strA > strB) return direction === 'ascend' ? 1 : -1;
      return 0;
    });
  }

  getFieldValue(item: Division, field: string): any {
    switch (field) {
      case 'name': return item.name;
      case 'parentDivision': return item.parentDivision?.name;
      case 'collaborators': return item.collaboratorsCount;
      case 'level': return item.level;
      case 'subdivisions': return item.subdivisionsCount;
      case 'ambassador': return item.ambassadorName || '';
      default: return '';
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { sort } = params;
    if (sort && sort.length > 0) {
      this.sortField = sort[0].key;
      this.sortDirection = sort[0].value as 'ascend' | 'descend' | null;
    } else {
      this.sortField = null;
      this.sortDirection = null;
    }
    this.filterDivisions();
  }

  changeView(view: string): void {
    this.activeView = view;
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
  }

  showCreateModal(): void {
    this.isCreateModalVisible = true;
  }

  handleCreateModalCancel(): void {
    this.isCreateModalVisible = false;
  }

  handleCreateDivision(): void {
    this.isCreateModalVisible = false;
    this.loadDivisions();
  }

  toggleColumn(column: string): void {
    this.visibleColumns[column as keyof typeof this.visibleColumns] =
      !this.visibleColumns[column as keyof typeof this.visibleColumns];
  }
}
