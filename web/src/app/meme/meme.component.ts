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

  @Input()
  public prefix!: string;

  public text: string;

  constructor() {
    this.text = '';
  }

  public copyToClipboard(): void {
    const textarea = document.createElement('textarea');

    textarea.style.position = 'fixed';
    textarea.style.left = '0';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    textarea.value = `${this.customPrefix ?? `${this.prefix} ${this.name}`} ${this.text}`;
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

}
