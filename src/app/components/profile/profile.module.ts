// import { PolicyRoutingModule } from './../policy/policy.routing.module';
import { NbCardModule, NbIconModule, NbSpinnerModule, NbTagModule } from '@nebular/theme';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { ProfileSectionComponent } from './profile-section/profile-section.component';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../shared.module';
import { ProfileRoutingModule } from './profile.routing.module';

@NgModule({
  declarations: [ProfileComponent, ProfileSectionComponent],
  imports: [CommonModule, NbCardModule, ThemeModule,  NbSpinnerModule, ProfileRoutingModule, SharedModule, NbIconModule, NbTagModule,]
})

export class ProfileModule {}
