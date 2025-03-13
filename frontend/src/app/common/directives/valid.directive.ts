import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValid]'
})
export default class ValidDirective {

  @Input() appValid: boolean = false;
  
  constructor(
    private _el: ElementRef<HTMLInputElement>
  ) { }

  @HostListener("keyup") keyup(){
    if(this.appValid){
    this._el.nativeElement.className = "form-control is-valid"
      }else{
    this._el.nativeElement.className = "form-control is-invalid"  
    }
  }
} 
