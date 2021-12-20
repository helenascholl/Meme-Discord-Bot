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
  public memes: Meme[];

  constructor(private configService: ConfigService) {
    this.inviteLink = 'https://discordapp.com/oauth2/authorize?&client_id=916227104666968074&scope=bot&permissions=34816';
    this.memes = [];
  }

  public ngOnInit(): void {
    this.reload();
  }

  public getVisibleMemes(): Meme[] {
    return this.memes.filter(m => m.visible);
  }

  public reload(): void {
    this.configService.updateConfig()
      .subscribe(c => {
        this.memes = c.map(m => {
          return {
            name: m.name,
            filename: m.filename,
            customPrefix: m.customPrefix,
            visible: true
          };
        });
      });
  }

  public filter(value: string) {
    this.memes.forEach(m => m.visible = m.name.startsWith(value));
  }

}

interface Meme extends Config {

  visible: boolean;

}
