
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingViewComponent } from './booking-view/booking-view.component';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [
      { path: 'list', component: BookingListComponent },
      { path: ':bookingId/details', component: BookingViewComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

//
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
