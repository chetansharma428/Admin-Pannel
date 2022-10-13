import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationPageComponent } from "./configuration-page/configuration-page.component";

const routes: Routes = [
  {
    path: '',
    component: ConfigurationPageComponent,
    // children: [
    //   {path: '', component: LayoutComponent}
    // ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ConfigurationRoutingModule {}
