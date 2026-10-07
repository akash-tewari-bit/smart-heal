import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// Declare the webkitSpeechRecognition and SpeechRecognition interfaces
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  recognition: any;
  private voiceToTextSubject = new Subject<string>();
  public recognizedText$ = this.voiceToTextSubject.asObservable();
  isListening = false;

  constructor(private ngZone: NgZone) {}

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true; // Get results while speaking
    this.recognition.continuous = true; // Keep listening after a phrase

    this.recognition.addEventListener('result', (event: any) => {
      this.ngZone.run(() => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        this.voiceToTextSubject.next(transcript);
      });
    });

    this.recognition.addEventListener('end', () => {
      this.ngZone.run(() => {
        this.isListening = false;
        // Optional: Re-start recognition if continuous listening is desired after auto-stop (e.g., after 30-45s silence)
      });
    });

    this.recognition.addEventListener('error', (event: any) => {
        console.error('Speech recognition error', event.error);
    });
  }

  start() {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
