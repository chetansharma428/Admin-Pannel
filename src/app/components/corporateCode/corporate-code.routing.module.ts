import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddCorporatecodeComponent } from "./add-corporatecode/add-corporatecode.component";
import { CorporateCodeSectionComponent } from "./corporate-code-section/corporate-code-section.component";
import { CorporateCodeComponent } from "./corporate-code/corporate-code.component";
import { UpdateCorporateCodeComponent } from "./update-corporate-code/update-corporate-code.component";

const routes: Routes = [{
  path: '',
  component: CorporateCodeComponent,
  children: [
    {
      path: 'list',
      component: CorporateCodeSectionComponent,
    },
    {
      path: 'create-corporateCode',
      component: AddCorporatecodeComponent,
    },
    {
      path: 'update-corporateCode/:corporateCode',
      component: UpdateCorporateCodeComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CorporateCodeRoutingModule {}
