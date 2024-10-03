import { Injectable } from '@angular/core';

declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MorseCodeService {

  private morseCode: string[] = [
    /* A */ '.-',   /* B */ '-...', /* C */ '-.-.', /* D */ '-..',
    /* E */ '.',    /* F */ '..-.', /* G */ '--.',  /* H */ '....',
    /* I */ '..',   /* J */ '.---', /* K */ '-.-',  /* L */ '.-..',
    /* M */ '--',   /* N */ '-.',   /* O */ '---',  /* P */ '.--.',
    /* Q */ '--.-', /* R */ '.-.',  /* S */ '...',  /* T */ '-',
    /* U */ '..-',  /* V */ '...-', /* W */ '.--',  /* X */ '-..-',
    /* Y */ '-.--', /* Z */ '--..'
  ];

  private alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor() { }

  translateToText(input: string): string {
    const morseToLetterMap: { [key: string]: string } = {};

    this.morseCode.forEach((code, index) => {
      morseToLetterMap[code] = this.alphabet[index];
    });

    return input
      .split(' ')
      .map(code => {
        if (code === '/') {
          return ' ';
        } else {
          return morseToLetterMap[code] || '';
        }
      })
      .join('');
  }

  translateToMorse(input: string) {
    const letterToMorseMap: { [key: string]: string } = {};

    this.alphabet.forEach((letter, index) => {
      letterToMorseMap[letter] = this.morseCode[index];
    });

    return input
      .toUpperCase()
      .split('')
      .map(letter => {
        if (letter === ' ') {
          return '/';
        } else {
          return letterToMorseMap[letter] || '';
        }
      })
      .join(' ');
  }

  translateToSound(input: string) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const DIT_DURATION = 100; // Dauer für einen Punkt (.)
    const DAH_DURATION = 300; // Dauer für einen Strich (-)
    const GAP_DURATION = 100; // Lücke zwischen Tönen
    const WORD_GAP_DURATION = 700; // Lücke zwischen Wörtern (/)

    let currentTime = audioContext.currentTime;

    const playTone = (frequency: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(1, currentTime); // Lautstärke an
      oscillator.start(currentTime);

      currentTime += duration / 1000;
      gainNode.gain.setValueAtTime(0, currentTime);
      oscillator.stop(currentTime); //
    };

    // Morse-Code-Übersetzung
    input.split('').forEach((symbol) => {
      switch (symbol) {
        case '.':
          playTone(600, DIT_DURATION); // Punkt (.) - kurzer Ton
          currentTime += GAP_DURATION / 1000;
          break;
        case '-':
          playTone(600, DAH_DURATION); // Strich (-) - langer Ton
          currentTime += GAP_DURATION / 1000;
          break;
        case ' ':
          currentTime += GAP_DURATION / 1000; // Lücke zwischen Buchstaben
          break;
        case '/':
          currentTime += WORD_GAP_DURATION / 1000; // Längere Pause zwischen Wörtern
          break;
        default:
          break;
      }
    });
  }

}
