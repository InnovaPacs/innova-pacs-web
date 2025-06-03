import { Injectable, ElementRef } from "@angular/core";
declare var Choices: any;
declare var flatpickr: any;

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
    constructor() { }

    initChoices(rename: any, selectRef: ElementRef)  {
    if (rename) {
      rename.destroy();
    }

    const select = selectRef.nativeElement;
    rename = new Choices(select, {
      removeItemButton: false,
      placeholder: true,
      shouldSort: false
    });
  }

  initFlatpickr(instance: any, dateRef: ElementRef) {
    if (instance) {
      instance.destroy();
    }
    instance = flatpickr(dateRef.nativeElement);
  }
}