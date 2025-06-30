import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private tokenEndpoint = '3CVelFCBQqPlRvTXRioPF6fmUdgaYfGPbzn4tOEVZFVVBMBaqnj1JQQJ99BAACHYHv6AArohAAABAZBS2kay.8pgBnsbkzeQ1joLGDQjWbm1EoSWi65D6FOMQRKNJCnSQln52rifgJQQJ99BAACHYHv6AArohAAABAZBS2Opl';
  private directLineEndpoint = 'https://directline.botframework.com/v3/directline/conversations';
  private token: string = '';
  private conversationId: string = '';

  constructor(private http: HttpClient) {}

  async getToken(): Promise<string> {
    // You may need to add authentication headers here if required by your endpoint
    const result: any = await this.http.get(this.tokenEndpoint).toPromise();
    this.token = result.token;
    return this.token;
  }

  async startConversation(): Promise<string> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    const result: any = await this.http.post(this.directLineEndpoint, {}, { headers }).toPromise();
    this.conversationId = result.conversationId;
    return this.conversationId;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // 1. Add required headers
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'  // Required for POST requests
      });
  
      // 2. Ensure conversationId exists
      if (!this.conversationId) {
        throw new Error('No active conversation. Start conversation first.');
      }
  
      const url = `${this.directLineEndpoint}/${this.conversationId}/activities`;
      
      // 3. Properly structured message body
      const body = {
        type: 'message',
        from: { id: 'user1' },
        text: message
      };
  
      // 4. Send message with error handling
      await this.http.post(url, body, { headers }).toPromise();
  
      // 5. Get activities with error handling
      const response: any = await this.http.get(url, { headers }).toPromise();
      
      // 6. Robust bot message filtering
      const botMessages = response.activities.filter((a: any) => 
        a.from.id !== 'user1' && 
        a.type === 'message' && 
        a.text
      );
  
      // 7. Return latest bot text or default message
      return botMessages.length 
        ? botMessages[botMessages.length - 1].text 
        : 'Bot is processing your request...';
  
    } catch (error) {
      // 8. Detailed error handling
      console.error('Message send error:', error);
      return 'Failed to get bot response. Please try again.';
    }
  }
  
}
