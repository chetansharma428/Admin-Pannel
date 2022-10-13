import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddProvidersComponent } from "./add-providers/add-providers.component";
import { EditProvidersComponent } from "./edit-providers/edit-providers.component";
import { ProviderConfigSectionComponent } from "./provider-config-section/provider-config-section.component";
import { ProviderConfigComponent } from "./provider-config/provider-config.component";

const routes: Routes = [{
  path: '',
  component: ProviderConfigComponent,
  children: [
    {
      path: 'list',
      component: ProviderConfigSectionComponent,
    },
    {
      path: 'add-provider',
      component: AddProvidersComponent,
    },
    {
      path: 'update-provider/:id',
      component: EditProvidersComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProviderConfigRoutingModule {}
