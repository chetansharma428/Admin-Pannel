import { NgModule } from "@angular/core";
import { NbCardModule, NbThemeModule, NbToggleModule, NbIconModule } from '@nebular/theme';

import { HeadingPanelComponent } from './utils/heading-panel/heading-panel.component';
import { ToggleButtonComponent } from "./utils/toggle-button/toggle-button.component";
import { MoreInfoComponent } from './utils/more-info/more-info.component';
import { DownloadCsvComponent } from './utils/download-csv/download-csv.component';
import { ExcelService } from "../lib/services/excel-service/excel.service";

@NgModule ({
  declarations: [HeadingPanelComponent, ToggleButtonComponent, MoreInfoComponent, DownloadCsvComponent],
  imports: [NbCardModule, NbThemeModule, NbToggleModule, NbIconModule],
  exports: [HeadingPanelComponent, ToggleButtonComponent, MoreInfoComponent, DownloadCsvComponent],
  providers:[ExcelService]
})

export class SharedModule {}
