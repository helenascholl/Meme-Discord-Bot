import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-meme',
  templateUrl: './meme.component.html',
  styleUrls: ['./meme.component.scss']
})
export class MemeComponent {

  @Input()
  public imagePath!: string;

  @Input()
  public meme!: string;

  @Input()
  public customPrefix: string | undefined;

  constructor() { }

}
