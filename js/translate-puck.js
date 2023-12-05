const pitchMap = { "a": 220, "a#": 233.08, "b": 246.94, "c": 261.63,
  "c#": 277.18, "d": 293.66, "d#": 311.13, "e": 329.63, "f": 349.23,
  "f#": 369.99, "g": 392, "g#": 415.3, "A": 440, "A#": 466.16,
  "B": 493.88, "C": 523.25, "C#": 554.37, "D": 587.33, "D#": 622.25,
  "E": 659.26, "F": 698.46, "F#": 739.99, "G": 783.99, "G#": 830.61 };

const heman = "ee  ee  ee  C#C#C#C#   C#C#  C#C#  AA  AA  AA  AA  ee  ee  ee  dddddd  c#c#  c#c#c#c#    dd  dd  C#C#  BBBB    dd  dd  dddd   C#C#C#C#   BBBBB  BB  C#C#C# AAAAAA     AA  f#f#  AA  f#f#  AA  AAAAA  AA  BBBB   BBB  C#C#C#C#   AAAAA";

const sinterklaas_one = 'gggg  gggg  AAAA  AAAA  gggAAAgggfffeeeeecccccc';
const sinterklaas_two = 'ffff  ffff  ffff  dddddd fffffff  fffffff     AAAA  gggg  ffff  eeee  ddddddd  ccccccc';
const sinterklaas_verse = sinterklaas_one + ' ' + sinterklaas_one + ' ' + sinterklaas_two + '     ';

function translate(puck_song, speed) {
  const frequencies = [];
  const durations = [];
  const pauses = [];

  let lastFrequency = '';
  for (let i = 0; i < puck_song.length; i++) {
    let frequency = puck_song[i];
    if (puck_song[i + 1] === '#') {
      frequency += '#';
      i+= 1;
    }
    
    if (frequency !== lastFrequency) {
      if (frequency !== ' ') {
        frequencies.push(pitchMap[frequency]);
        durations.push(speed);
        pauses.push(0);
      } else {
        pauses[pauses.length - 1] += speed;
      }
    } else {
      if (frequency !== ' ') {
        durations[durations.length - 1] += speed;
      } else {
        pauses[pauses.length - 1] += speed;
      }
    }
    lastFrequency = frequency;
  }

  const noteDefinitions = frequencies.map((freq, i) => [freq, durations[i], pauses[i]]);
  const arraySize = noteDefinitions.length;
  const allCharArrays = noteDefinitions.map(convertNoteDefintionToCharArray).join(',');
  const output = `const note notes[${arraySize}] PROGMEM = {${allCharArrays}};`;

  console.log(output);
}

function convertNoteDefintionToCharArray(noteDefinition) {
  const coercedNotes = noteDefinition.map(coerceInteger);
  return `{${coercedNotes.join(',')}}`;
}

function coerceInteger(val) {
  return parseInt(val, 10)
}

translate(sinterklaas_verse, 50);
