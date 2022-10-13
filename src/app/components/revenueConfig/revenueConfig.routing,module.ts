import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddRevenueRuleSetComponent } from "./add-revenue-rule-set/add-revenue-rule-set.component";
import { RevenueSectionComponent } from "./revenue-section/revenue-section.component";
import { RevenueComponent } from "./revenue/revenue.component";
import { UpdateRevenueRuleSetComponent } from "./update-revenue-rule-set/update-revenue-rule-set.component";

const routes: Routes = [{
  path: '',
  component: RevenueComponent,
  children: [
    {
      path: 'list',
      component: RevenueSectionComponent,
    },
    {
      path: 'add-revenue-rule-set',
      component: AddRevenueRuleSetComponent,
    },
    {
      path: 'update-revenue-rule-set/:id',
      component: UpdateRevenueRuleSetComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RevenueConfigRoutingModule {}
