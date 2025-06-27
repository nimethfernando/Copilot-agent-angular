import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html'
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