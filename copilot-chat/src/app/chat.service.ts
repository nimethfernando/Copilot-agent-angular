import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private tokenEndpoint = 'https://defaultb8003b8e9fe846928f6f94f6c45bf0.0d.environment.api.powerplatform.com/powervirtualagents/botsbyschema/crda8_beta/directline/token?api-version=2022-03-01-preview';
  private directLineEndpoint = 'https://directline.botframework.com/v3/directline/conversations';
  private token: string = '';
  private conversationId: string = '';

  constructor(private http: HttpClient) {}

  async getToken(): Promise<string> {
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
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    const url = `${this.directLineEndpoint}/${this.conversationId}/activities`;
    const body = {
      type: 'message',
      from: { id: 'user1' },
      text: message
    };
    await this.http.post(url, body, { headers }).toPromise();
    const activities: any = await this.http.get(url, { headers }).toPromise();
    const botMessages = activities.activities.filter((a: any) => a.from.id !== 'user1');
    return botMessages.length ? botMessages[botMessages.length - 1].text : '';
  }
}