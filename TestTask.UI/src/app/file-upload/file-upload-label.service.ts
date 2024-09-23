import { Injectable } from '@angular/core';
import { LabelOption } from './file-upload-label.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private labelsSubj = new BehaviorSubject<LabelOption[]> ([
      { label: 'Pickup store #', options: [], cellValue: '' },
      { label: 'Pickup store Name', options: [], cellValue: '' },
      { label: 'Pickup lat', options: [], cellValue: '' },
      { label: 'Pickup lon', options: [], cellValue: '' },
      { label: 'Pickup formatted Address', options: [], cellValue: '' },
      { label: 'Pickup Contact Name First Name', options: [], cellValue: '' },
      { label: 'Pickup Contact Name Last Name', options: [], cellValue: '' },
      { label: 'Pickup Contact Email', options: [], cellValue: '' },
      { label: 'Pickup Contact Mobile Number', options: [], cellValue: '' },
      { label: 'Pickup Enable SMS Notification', options: [], cellValue: '' },
      { label: 'Pickup Time', options: [], cellValue: '' },
      { label: 'Pickup tolerance (min)', options: [], cellValue: '' },
      { label: 'Pickup Service Time', options: [], cellValue: '' },
      { label: 'Delivery store #', options: [], cellValue: '' },
      { label: 'Delivery store Name', options: [], cellValue: '' },
      { label: 'Delivery lat (req if adding new customer)', options: [], cellValue: '' },
      { label: 'Delivery long (req if adding new customer)', options: [], cellValue: '' },
      { label: 'Delivery formatted Address', options: [], cellValue: '' },
      { label: 'Delivery Contact First Name', options: [], cellValue: '' },
      { label: 'Delivery Contact Last Name', options: [], cellValue: '' },
      { label: 'Delivery Contact Email', options: [], cellValue: '' },
      { label: 'Delivery Contact Mobile Number (need 0 at the front)', options: [], cellValue: '' },
      { label: 'Delivery Enable SMS Notification', options: [], cellValue: '' },
      { label: 'Delivery Time', options: [], cellValue: '' },
      { label: 'Delivery Tolerance (Min past Delivery Time)', options: [], cellValue: '' },
      { label: 'Delivery Service Time (min)', options: [], cellValue: '' },
      { label: 'Order Details', options: [], cellValue: '' },
      { label: 'Assigned Driver', options: [], cellValue: '' },
      { label: 'Customer reference', options: [], cellValue: '' },
      { label: 'Payer', options: [], cellValue: '' },
      { label: 'Vehicle', options: [], cellValue: '' },
      { label: 'Weight', options: [], cellValue: '' },
      { label: 'Price', options: [], cellValue: '' }
    ]);

  getLabels() {
    return this.labelsSubj.asObservable();
  }

  updateCellValue(index: number, value: string) {
      const currentLabels = this.labelsSubj.value;
      if (currentLabels[index]) {
          currentLabels[index].cellValue = value;
          this.labelsSubj.next(currentLabels);
      }
  }
}
