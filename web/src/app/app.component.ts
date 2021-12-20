import { Component, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  public readonly inviteLink: string;
  public shownMemes: Config[];

  constructor(private configService: ConfigService) {
    this.inviteLink = 'https://discordapp.com/oauth2/authorize?&client_id=916227104666968074&scope=bot&permissions=34816';
    this.shownMemes = [];
  }

  public ngOnInit(): void {
    this.reload();
  }

  public reload(): void {
    this.configService.updateConfig()
      .subscribe(c => this.shownMemes = c);
  }

  public filter(value: string) {
    this.shownMemes = this.configService.config
      .filter(c => c.name.startsWith(value));
  }

}
