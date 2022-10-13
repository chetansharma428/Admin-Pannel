import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddPassthroughComponent } from "./add-passthrough/add-passthrough.component";
import { PassthroughSectionComponent } from "./passthrough-section/passthrough-section.component";
import { PassthroughComponent } from "./passthrough/passthrough.component";
import { UpdatePassconfigComponent } from "./update-passconfig/update-passconfig.component";

const routes: Routes = [{
  path: '',
  component: PassthroughComponent,
  children: [
    {
      path: 'list',
      component: PassthroughSectionComponent,
    },
    {
      path: 'create-passthrough',
      component: AddPassthroughComponent,
    },
    {
      path: 'update-passthroughconfig/:profileId',
      component: UpdatePassconfigComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PassThroughtRoutingModule {}
