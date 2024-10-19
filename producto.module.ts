import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';

@NgModule({
  declarations: [
    NuevoProductoComponent // Debes declarar tu componente aquí
  ],
  imports: [
    CommonModule, // Necesario para *ngIf, *ngFor, etc.
    ReactiveFormsModule // Necesario para usar formularios reactivos
  ]
})
export class ProductoModule { }