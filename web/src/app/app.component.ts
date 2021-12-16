import { Component } from '@angular/core';
import config from '../assets/config.json';
import { Config } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  public readonly config = config as Config[];

}
