import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Division } from '../../models/division.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import {DivisionService} from '../../services/devision.service';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {CommonModule} from '@angular/common';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-division',
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
  templateUrl: './create-division.component.html',
  styleUrl: './create-division.component.scss'
})
export class CreateDivisionComponent implements OnInit {
  @Input() isVisible?: boolean;
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  divisions: Division[] = [];
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

  initForm(): void {
    this.divisionForm = this.fb.group({
      name: ['', [Validators.required]],
      parentDivision: [null],
      ambassador: [''],
    });
  }

  loadDivisions(): void {
    this.divisionService.getDivisions().subscribe({
      next: (data) => {
        this.divisions = data;
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
    if (this.divisionForm.valid) {
      const formValue = this.divisionForm.value;

      const newDivision: Partial<Division> = {
        name: formValue.name,
        parentDivisionId: formValue.parentDivision || null,
        ambassadorName: formValue.ambassador || null,
      };
      this.divisionService.createDivision(newDivision).subscribe({
        next: () => {
          this.message.success('División creada exitosamente');
          this.create.emit();
          this.divisionForm.reset();
        },
        error: (err) => {
          this.message.error('Error al crear la división');
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
