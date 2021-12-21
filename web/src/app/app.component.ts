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
  public readonly sortTypes: [string, string][];
  public memes: Meme[];
  public sortType: string;
  public sortDirection: SortDirection;

  constructor(private configService: ConfigService) {
    this.inviteLink = 'https://discordapp.com/oauth2/authorize?&client_id=916227104666968074&scope=bot&permissions=34816';
    this.sortTypes = [
      [ 'date-added', 'Date added' ],
      [ 'alphabetical', 'Alphabetical' ]
    ];
    this.memes = [];
    this.sortDirection = SortDirection.DESCENDING;
    this.sortType = this.sortTypes[0][0];
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
        this.memes = c.map((m, i) => {
          return {
            name: m.name,
            filename: m.filename,
            customPrefix: m.customPrefix,
            visible: true,
            order: i
          };
        });

        this.sort();
      });
  }

  public filter(value: string): void {
    this.memes.forEach(m => m.visible = m.name.startsWith(value));
  }

  public sort(): void {
    switch (this.sortType) {
      case 'date-added':
        this.memes = this.memes.sort((m1, m2) => m1.order - m2.order);
        break;

      case 'alphabetical':
        this.memes = this.memes.sort((m1, m2) => m1.name.localeCompare(m2.name));
        break;
    }

    if (this.sortDirection === SortDirection.ASCENDING) {
      this.memes = this.memes.reverse();
    }
  }

  public changeSortDirection(): void {
    if (this.sortDirection === SortDirection.ASCENDING) {
      this.sortDirection = SortDirection.DESCENDING;
    } else {
      this.sortDirection = SortDirection.ASCENDING;
    }

    this.sort();
  }

}

interface Meme extends Config {

  visible: boolean;
  order: number;

}

enum SortDirection {

  ASCENDING,
  DESCENDING

}
