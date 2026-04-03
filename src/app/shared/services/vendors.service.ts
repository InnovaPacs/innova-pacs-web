import { Injectable, ElementRef } from '@angular/core';
declare var Choices: any;
declare var flatpickr: any;

@Injectable({
  providedIn: 'root',
})
export class VendorsService {
  constructor() {}

  initChoices(instance: any, selectRef: ElementRef): any {
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }

    if (!selectRef || !selectRef.nativeElement) {
      return null;
    }

    const select = selectRef.nativeElement;

    return new Choices(select, {
      removeItemButton: false,
      placeholder: true,
      shouldSort: false,
      allowHTML: true,
    });
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

  setChoicesForSelect(instance: any, id: string, label: string) {
    instance.setChoices(
      [
        {
          value: id,
          label: label,
          selected: false,
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
