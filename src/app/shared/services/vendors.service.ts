import { Injectable, ElementRef } from '@angular/core';
declare var Choices: any;
declare var flatpickr: any;

@Injectable({
  providedIn: 'root',
})
export class VendorsService {
  constructor() {}

  initChoices(instance: any, selectRef: ElementRef): any {
    console.log('Initializing Choices instance');
    if (instance && typeof instance.destroy === 'function') {
      console.log('Destroying existing Choices instance');
      instance.destroy();
    }

    if (!selectRef || !selectRef.nativeElement) {
      console.log('Select reference is invalid');
      return null;
    }

    const select = selectRef.nativeElement;

    const newInstance = new Choices(select, {
      removeItemButton: false,
      placeholder: true,
      shouldSort: false,
      allowHTML: true,
    });

    console.log('New Choices instance created:', newInstance);
    return newInstance;
  }

  setChoices(instance: any, id: string, label: string) {
    instance.setChoices(
      [
        {
          value: id,
          label: label,
          selected: true,
        },
      ],
      'value',
      'label',
      false
    );
  }

  initFlatpickr(instance: any, dateRef: ElementRef) {
    if (instance) {
      instance.destroy();
    }
    instance = flatpickr(dateRef.nativeElement);
  }

  private disableControl(form: any, controlName: string) {
    form.get(controlName)?.disable();
  }
}
