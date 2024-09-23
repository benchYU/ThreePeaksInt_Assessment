import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LabelService } from './file-upload-label.service';
import { LabelOption } from './file-upload-label.model';
import { Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {


  importForm: FormGroup;
  worksheet: ExcelJS.Worksheet[] = [];
  highlightIndices: boolean[] = [];
  labelOptions: LabelOption[] = [];
  selectOptions: any[] = [];
  rowOptions: any[] = [];
  jsonData: any[] = [];
  rowNumber: number = 2;


  constructor(private fb: FormBuilder,
    public labelService: LabelService) {
    this.importForm = this.fb.group({
      uploadLabels: this.fb.array([]),
      dropdown: ['']
    });

    this.loadLabels();
  }

  ngOnInit() {
    this.labelService.getLabels().subscribe(labels => {
      this.labelOptions = labels;
      this.loadLabels();
    });
  }

  get uploadLabels(): FormArray {
      return this.importForm.get('uploadLabels') as FormArray;
  }

  loadLabels() {
      this.labelOptions.forEach(label => {
          this.uploadLabels.push(this.fb.control(''));
      });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      this.parseExcel(arrayBuffer);
    };

    fileReader.readAsArrayBuffer(file);
  }

  parseExcel(arrayBuffer: any): void {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(arrayBuffer).then((workbook) => {
      
      this.worksheet.push(workbook.worksheets[0]);
      
      workbook.eachSheet((worksheet, sheetId) => {
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          let rowData: any = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[`column${colNumber}`] = cell.value?.toString().replace(/[\r\n]+/g, '').trim();
          });
          this.jsonData.push(rowData);
        });
      });
      
      if (this.jsonData[0]) {
        this.selectOptions = Object.values(this.jsonData[0]);        
        this.rowOptions = Array.from({ length: this.jsonData.length - 1 }, (_, i) => i + 2);
      }
    });
  }

  onValidate() {
    const labelsArray = this.importForm.get('uploadLabels') as FormArray;
    
    if (labelsArray) {
      const controls = labelsArray.controls;

      controls.forEach((control, index) => {
        const labelValue = this.labelOptions[index].label;
        const selectedValue = control.value;

        this.highlightIndices[index] = selectedValue !== labelValue;
      });
    }
  }

  onOptionChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const correspondingLabel = this.labelOptions[index].label;

    if (this.worksheet){
      const headerRow = this.worksheet[0].getRow(1);
      const firstDataRow = this.worksheet[0].getRow(this.rowNumber);

      const headers = headerRow.values && Array.isArray(headerRow.values) && headerRow.values.length > 1 ?
        headerRow.values.slice(1) : [];

      const firstRow = firstDataRow.values && Array.isArray(firstDataRow.values) && firstDataRow.values.length > 1 ?
        firstDataRow.values.slice(1) : [];
        
      let rowCell = firstRow[headers.findIndex(h => h === correspondingLabel && h === selectElement.value)]?.toString();
      this.labelOptions[index].cellValue = rowCell ?  rowCell : '' ;
    }
  }

  onRowNumChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.rowNumber = Number(selectElement.value);

    this.importForm.get('uploadLabels')?.reset();
    this.labelOptions.forEach(label => {
        label.cellValue = '';
    });
  }

  onImport() {
    alert(JSON.stringify(this.jsonData[this.rowNumber - 1], null, 2));
  }

}