import {Component, signal} from '@angular/core';
import {MorseCodeService} from "../morse-code.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-encoding',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './decoding.component.html',
  styleUrl: './decoding.component.css'
})
export class DecodingComponent {
  inputSignal = signal<string>('');
  outputSignal = signal<string>('');

  constructor(private morseCodeService: MorseCodeService) {}

  translate(): void {
    const input = this.inputSignal();
    const output = this.morseCodeService.translateToText(input);
    this.outputSignal.set(output);
  }

  sound() {
    this.morseCodeService.translateToSound(this.inputSignal());
  }
}
