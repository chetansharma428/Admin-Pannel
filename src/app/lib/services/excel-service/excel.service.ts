import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SuccessDialogComponent } from '../../../components/utils/dialogs/success-dialog/success-dialog.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private readonly dialog: NbDialogService) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    console.log(json);
    if(json.length >= 1) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    } else {
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Data not found for respective search.'
        }
      })
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
