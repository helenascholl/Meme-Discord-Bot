import { Component } from '@angular/core';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  public readonly inviteLink: string;

  constructor(public configService: ConfigService) {
    this.inviteLink = 'https://discordapp.com/oauth2/authorize?&client_id=916227104666968074&scope=bot&permissions=34816';
  }

}
