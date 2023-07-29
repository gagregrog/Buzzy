const pitchMap = { "a": 220, "a#": 233.08, "b": 246.94, "c": 261.63,
  "c#": 277.18, "d": 293.66, "d#": 311.13, "e": 329.63, "f": 349.23,
  "f#": 369.99, "g": 392, "g#": 415.3, "A": 440, "A#": 466.16,
  "B": 493.88, "C": 523.25, "C#": 554.37, "D": 587.33, "D#": 622.25,
  "E": 659.26, "F": 698.46, "F#": 739.99, "G": 783.99, "G#": 830.61 };

const heman = "ee  ee  ee  C#C#C#C#   C#C#  C#C#  AA  AA  AA  AA  ee  ee  ee  dddddd  c#c#  c#c#c#c#    dd  dd  C#C#  BBBB    dd  dd  dddd   C#C#C#C#   BBBBB  BB  C#C#C# AAAAAA     AA  f#f#  AA  f#f#  AA  AAAAA  AA  BBBB   BBB  C#C#C#C#   AAAAA";

function translate(puck_song, speed) {
  const notes = [];
  const durations = [];
  const pauses = [];

  let lastNote = '';
  for (let i = 0; i < puck_song.length; i++) {
    let note = puck_song[i];
    if (puck_song[i + 1] === '#') {
      note += '#';
      i+= 1;
    }
    
    if (note !== lastNote) {
      if (note !== ' ') {
        notes.push(pitchMap[note]);
        durations.push(speed);
        pauses.push(0);
      } else {
        pauses[pauses.length - 1] += speed;
      }
    } else {
      if (note !== ' ') {
        durations[durations.length - 1] += speed;
      } else {
        pauses[pauses.length - 1] += speed;
      }
    }
    lastNote = note;
  }

  const output = `
uint16_t noteFrequencies[] = {${notes.map((frequency) => parseInt(frequency, 10)).join(',')}};
uint16_t noteDurations[] = {${durations.map((duration) => parseInt(duration, 10)).join(',')}};
uint16_t notePauses[] = {${pauses.map((pause) => parseInt(pause, 10)).join(',')}};
uint16_t numberOfNotes = ${notes.length};
  `;

  console.log(output);
}

translate(heman, 50);
