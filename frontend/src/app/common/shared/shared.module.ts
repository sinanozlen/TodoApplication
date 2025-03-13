import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import ValidDirective from '../directives/valid.directive';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule,
    ValidDirective
  ],
  exports:[
    CommonModule,
    FormsModule, 
    RouterModule,
    ValidDirective
  ]
})
export class SharedModule { }
