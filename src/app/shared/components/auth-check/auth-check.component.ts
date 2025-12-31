import { Component, OnInit } from '@angular/core';
import { AppointmentsRoutingModule } from "../../../loggedin-wrapper/appointments/appointments-routing-module";

@Component({
  selector: 'app-auth-check',
  templateUrl: './auth-check.component.html',
  styleUrls: ['./auth-check.component.scss'],
  imports: [AppointmentsRoutingModule],
})
export class AuthCheckComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
