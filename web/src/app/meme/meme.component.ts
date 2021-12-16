import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-meme',
  templateUrl: './meme.component.html',
  styleUrls: [ './meme.component.scss' ]
})
export class MemeComponent {

  @Input()
  public name!: string;

  @Input()
  public filename!: string;

  @Input()
  public customPrefix: string | undefined;

  constructor() { }

}
