import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from '../../../lib/services/excel-service/excel.service';

@Component({
  selector: 'ngx-download-csv',
  templateUrl: './download-csv.component.html',
  styleUrls: ['./download-csv.component.scss']
})
export class DownloadCsvComponent implements OnInit {
  @Input() data;
  @Input() request;
  @Input() reportName;


  constructor(private readonly excelService: ExcelService) { }
  ngOnInit(): void {

  }

  exportTocsv() {
    this.excelService.exportAsExcelFile(this.data, this.reportName);
  }

}
