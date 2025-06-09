import { Injectable, ElementRef } from "@angular/core";
declare var Choices: any;
declare var flatpickr: any;

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
    constructor() { }

    initChoices(instance: any, selectRef: ElementRef)  {
    if (instance) {
      instance.destroy();
    }

    const select = selectRef.nativeElement;
    instance = new Choices(select, {
      removeItemButton: false,
      placeholder: true,
      shouldSort: false,
      allowHTML: true
    });

    return instance;
  }

  setChoices(instance: any, id: string, label: string) {
    instance.setChoices([
      {
        value: id,
        label: label,
        selected: true
      }
    ], 'value', 'label', false);
  }

  initFlatpickr(instance: any, dateRef: ElementRef) {
    if (instance) {
      instance.destroy();
    }
    instance = flatpickr(dateRef.nativeElement);
  }
}