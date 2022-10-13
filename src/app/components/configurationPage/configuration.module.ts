import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbCardModule } from "@nebular/theme";
import { ConfigurationPageComponent } from "./configuration-page/configuration-page.component";
import { ConfigurationRoutingModule } from "./configuration.routing,module";

@NgModule({
  declarations: [
    ConfigurationPageComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    ConfigurationRoutingModule
  ]
})

export class ConfigurationModule {}
