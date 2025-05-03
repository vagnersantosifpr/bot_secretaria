import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';  // Importe o ChatbotComponent
import { CommonModule } from '@angular/common'; // Importe CommonModule


@Component({
    selector: 'app-root',
    imports: [ChatbotComponent, CommonModule],
    // RouterOutlet,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatbot-frontend';
}
