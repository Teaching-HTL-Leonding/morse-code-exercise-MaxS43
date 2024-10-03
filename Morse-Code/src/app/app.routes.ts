import { Routes } from '@angular/router';
import {DecodingComponent} from "./decoding/decoding.component";
import {EncodingComponent} from "./encoding/encoding.component";

export const routes: Routes = [
  {path: 'decoding', component: DecodingComponent },
  {path: 'encoding', component: EncodingComponent },
  {path: '', redirectTo: '/encoding', pathMatch: 'full'}
];