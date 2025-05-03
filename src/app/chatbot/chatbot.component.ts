import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input'; // Exemplo
import { MatButtonModule } from '@angular/material/button'; // Exemplo
import { FormsModule } from '@angular/forms'; // Exemplo
import { provideHttpClient } from '@angular/common/http'; // Exemplo
import { MatListModule } from '@angular/material/list'; // Exemplo
import { GeminiService } from '../gemini.service';
import { marked } from 'marked'; // <-- Importe o marked


@Component({
  selector: 'app-chatbot',
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatListModule
  ], // Adicione seus imports aqui
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements AfterViewChecked {
  // @ViewChild('chatMessages') private chatMessages: ElementRef;
  @ViewChild('chatMessages') private chatMessages!: ElementRef; // Use !
  //@ViewChild('chatMessages') private chatMessages: ElementRef | undefined; // Use | undefined


  messages: { text: string, sender: string, isHtml?: boolean }[] = []; // Adicione isHtml (opcional, mas bom para clareza)
  newMessage: string = '';
  private shouldScroll = false; // Flag para controlar a rolagem

  //backendUrl: string = 'http://localhost:3000/api/chat'; // URL do seu backend

  // constructor(private http: HttpClient) { }
  constructor(private geminiService: GeminiService, private cdr: ChangeDetectorRef) {
    // Configuração opcional do Marked (exemplo: adicionar <br> para novas linhas)
    marked.use({ breaks: true });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToShowNewMessage();
      this.shouldScroll = false; // Reseta a flag após rolar
      this.cdr.detectChanges(); // Força detecção de mudanças após resetar a flag se necessário
    }
  }

  formatBotMessage(text: string): string {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br>');
    return formattedText;
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', text: this.newMessage, isHtml: false });
      const userMessage = this.newMessage; // Guarde a mensagem para enviar
      this.newMessage = ''; // Limpe o input imediatamente

      this.scrollToBottom(); // Role após adicionar a mensagem do usuário

      this.geminiService.sendMessage(userMessage)
        .subscribe(
          (response: any) => {
            //let botResponse = response.candidates[0].content.parts[0].text;
            // botResponse = botResponse.replace(/\n/g, '<br>'); // Substitua \n por <br>
            let botRawText = response.candidates[0]?.content?.parts[0]?.text || 'Não foi possível obter uma resposta.';

            // Processe o texto com marked para converter Markdown em HTML
            let botHtmlText = marked.parse(botRawText) as string; // Use 'as string' para tipagem


            console.log("Raw:", botRawText);
            console.log("Parsed HTML:", botHtmlText);

            // Adicione a mensagem processada como HTML
            this.messages.push({ sender: 'bot', text: botHtmlText, isHtml: true });
            // **Marca que a rolagem deve acontecer na próxima checagem do ciclo de vida**
            this.shouldScroll = true;
            this.cdr.detectChanges(); // Notifica Angular sobre a mudança na flag

            // this.scrollToBottom(); // Role após adicionar a mensagem do bot


          },
          (error) => {
            console.error('Erro ao receber resposta do Gemini:', error);
            this.messages.push({ sender: 'bot', text: 'Erro ao obter resposta.' });
            // this.scrollToBottom(); // Role após adicionar a mensagem de erro
            this.shouldScroll = true;
            this.cdr.detectChanges();

          }
        );

    }
  }

  scrollToBottom(): void {
    try {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) { }
  }

  scrollToShowNewMessage(): void {
    // Usamos um pequeno timeout para garantir que o DOM foi atualizado com a nova mensagem
    setTimeout(() => {
      try {
        const element = this.chatMessages.nativeElement;
        const scrollHeight = element.scrollHeight; // Altura total do conteúdo
        const clientHeight = element.clientHeight; // Altura da área visível
        const currentScrollTop = element.scrollTop; // Posição atual da rolagem

        // Calcula a posição máxima de rolagem (o ponto onde o último pixel do conteúdo é visível)
        const maxScrollTop = scrollHeight - clientHeight;

        // Se já estivermos perto do fundo (ex: dentro de 100px), rola totalmente para o fundo.
        // Isso evita que a rolagem pare 'quase no fim' repetidamente.
        const threshold = 100; // Ajuste este valor conforme necessário
        if (maxScrollTop - currentScrollTop <= threshold) {
          element.scrollTo({
            top: maxScrollTop,
            behavior: 'smooth'
          });
        } else {
          // Caso contrário, rola para mostrar uma parte da nova mensagem.
          // Define quanto espaço queremos deixar visível abaixo da rolagem atual.
          // Ex: Rolar para baixo o equivalente a 30% da altura visível, ou um valor fixo.
          const scrollIncrement = clientHeight * 0.5; // Rola metade da altura da tela para baixo
          // const scrollIncrement = 150; // Alternativa: Rolar um valor fixo (ex: 150 pixels)

          let targetScrollTop = currentScrollTop + scrollIncrement;

          // Garante que não rolemos além do máximo possível
          targetScrollTop = Math.min(targetScrollTop, maxScrollTop);

          // Garante que não tentamos rolar para uma posição negativa
          targetScrollTop = Math.max(0, targetScrollTop);

          console.log(`Scrolling partially. Current: ${currentScrollTop}, Target: ${targetScrollTop}, Max: ${maxScrollTop}`);

          element.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth' // Rolagem suave!
          });
        }

      } catch (err) {
        console.error("Erro ao rolar:", err);
      }
    }, 50); // Pequeno atraso (50ms) pode ajudar a garantir a renderização
  }

  // sendMessage() {
  //   if (this.newMessage.trim() !== '') {
  //     this.messages.push({ text: this.newMessage, sender: 'user' });

  //     this.http.post<{ response: string }>(this.backendUrl, { message: this.newMessage })
  //       .subscribe(response => {
  //         this.messages.push({ text: response.response, sender: 'bot' });
  //       });

  //     this.newMessage = '';
  //   }
  // }

}
