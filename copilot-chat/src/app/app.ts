import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, RouterOutlet],
  template: `<app-chat></app-chat>`,
  // styleUrl: './app.css'
})
export class App {
  protected title = 'copilot-chat';
}
