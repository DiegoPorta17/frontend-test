import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Division, UpdateDivision} from '../../models/division.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DivisionService } from '../../services/devision.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-update-division',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzToolTipModule
  ],
  templateUrl: './update-division.component.html',
  styleUrl: './update-division.component.scss'
})
export class UpdateDivisionComponent implements OnInit, OnChanges {
  @Input() isVisible?: boolean;
  @Input() division?: Division;
  @Output() update = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  availableDivisions: Division[] = [];
  divisionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private divisionService: DivisionService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDivisions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['division'] && changes['division'].currentValue) {
      console.log('Division changed:', changes['division'].currentValue);
      if (this.divisionForm) {
        this.populateForm();
      } else {
        console.log('Form not initialized yet');
        this.initForm();
        this.populateForm();
      }
    }
  }

  initForm(): void {
    this.divisionForm = this.fb.group({
      name: [this.division?.name, [Validators.required]],
      parentDivision: [this.division?.parentDivisionId || null],
      ambassador: [this.division?.ambassadorName || ''],
    });
  }

  populateForm(): void {
    if (this.division) {
      console.log('Populating form with division:', this.division);

      this.divisionForm.patchValue({
        name: this.division.name || '',
        parentDivision: this.division.parentDivisionId || null,
        ambassador: this.division.ambassadorName || ''
      });
      this.cdr.detectChanges();
    }
  }

  loadDivisions(): void {
    this.divisionService.getDivisions().subscribe({
      next: (data) => {
        // Filter out the current division to prevent self-reference
        if (this.division) {
          this.availableDivisions = data.filter(div => div.id !== this.division!.id);
        } else {
          this.availableDivisions = data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Error al cargar las divisiones');
        console.error(err);
      },
    });
  }

  handleCancel(): void {
    this.divisionForm.reset();
    this.cancel.emit();
  }

  handleSubmit(): void {
    if (this.divisionForm.valid && this.division) {
      const formValue = this.divisionForm.value;

      const updatedDivision: UpdateDivision = {
        name: formValue.name,
        parentDivisionId: formValue.parentDivision || null,
        ambassadorName: formValue.ambassador || null,
      };

      this.divisionService.updateDivision(this.division.id, updatedDivision).subscribe({
        next: () => {
          this.message.success('División actualizada exitosamente');
          this.update.emit();
          this.divisionForm.reset();
        },
        error: (err) => {
          this.message.error('Error al actualizar la división');
          console.error(err);
        },
      });
    } else {
      Object.values(this.divisionForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
