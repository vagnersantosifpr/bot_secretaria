import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
// import { ChatbotComponent } from './chatbot/chatbot.component'; // Importe o ChatbotComponent


@NgModule({
  declarations: [
    // AppComponent,
    // ChatbotComponent  // Declare o ChatbotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    BrowserAnimationsModule,
    CommonModule // Adicione o CommonModule aqui

  ],
  providers: [
    provideHttpClient() // Adicione provideHttpClient aos providers
  ],
  bootstrap: []
})
export class AppModule { }