import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule for @for/@if
  template: `
    <div style="max-width:400px;margin:auto;">
      <h2>Copilot Studio Chat</h2>
      @for (msg of messages; track msg) {
        <div>
          <b>{{msg.from}}:</b> {{msg.text}}
        </div>
      }
      <input [(ngModel)]="userMessage" 
             (keyup.enter)="send()" 
             placeholder="Type a message..." 
             style="width:80%;" />
      <button (click)="send()" [disabled]="loading">Send</button>
      @if (loading) {
        <div>Bot is typing...</div>
      }
    </div>
  `,
  styles: [`
    div { margin-bottom: 10px; }
    input { padding: 8px; }
    button { padding: 8px 15px; }
  `]
})
export class ChatComponent {
  userMessage = '';
  messages: { from: string, text: string }[] = [];
  loading = false;

  constructor(private chatService: ChatService) {}

  async ngOnInit() {
    await this.chatService.getToken();
    await this.chatService.startConversation();
  }

  async send() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ from: 'You', text: this.userMessage });
    this.loading = true;
    const reply = await this.chatService.sendMessage(this.userMessage);
    if (reply) this.messages.push({ from: 'Bot', text: reply });
    this.userMessage = '';
    this.loading = false;
  }
}
