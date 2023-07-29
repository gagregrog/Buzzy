const MidiConvert = require('simonadcock-midiconvert');
const fs = require('fs');

const DEBUG = false;

const midiToFrequency = {
  127: 12543.85, // G9
  126: 11839.82, // F#9/Gb9
  125: 11175.30, // F9
  124: 10548.08, //	E9	
  123: 9956.06, // D#9/Eb9
  122: 9397.27, // D9
  121: 8869.84, // C#9/Db9
  120: 8372.02, // C9
  119: 7902.13, //	B8	
  118: 7458.62, // A#8/Bb8
  117: 7040.00, // A8
  116: 6644.88, // G#8/Ab8
  115: 6271.93, // G8
  114: 5919.91, // F#8/Gb8
  113: 5587.65, // F8
  112: 5274.04, // E8
  111: 4978.03, // D#8/Eb8
  110: 4698.64, // D8
  109: 4434.92, // C#8/Db8
  108: 4186.01, //	C8
  107: 3951.07, //	B7
  106: 3729.31, //	A#7/Bb7
  105: 3520.00, //	A7
  104: 3322.44, //	G#7/Ab7
  103: 3135.96, //	G7
  102: 2959.96, //	F#7/Gb7
  101: 2793.83, //	F7
  100: 2637.02, //	E7
  99: 2489.02, //	D#7/Eb7
  98: 2349.32, //	D7
  97: 2217.46, //	C#7/Db7
  96: 2093.00, //	C7
  95: 1975.53, //	B6
  94: 1864.66, //	A#6/Bb6
  93: 1760.00, //	A6
  92: 1661.22, // G#6/Ab6
  91: 1567.98, // G6
  90: 1479.98, // F#6/Gb6
  89: 1396.91, // F6
  88: 1318.51, // E6
  87: 1244.51, // D#6/Eb6
  86: 1174.66, // D6
  85: 1108.73, // C#6/Db6
  84: 1046.50, // C6
  83: 987.77, // B5
  82: 932.33, // A#5/Bb5
  81: 880.00, // A5
  80: 830.61, // G#5/Ab5
  79: 783.99, // G5
  78: 739.99, // F#5/Gb5
  77: 698.46, // F5
  76: 659.26, // E5
  75: 622.25, // D#5/Eb5
  74: 587.33, // D5
  73: 554.37, // C#5/Db5
  72: 523.25, // C5
  71: 493.88, // B4
  70: 466.16, // A#4/Bb4
  69: 440.00, // A4
  68: 415.30, // G#4/Ab4
  67: 392.00, // G4
  66: 369.99, // F#4/Gb4
  65: 349.23, // F4
  64: 329.63, // E4
  63: 311.13, // D#4/Eb4
  62: 293.66, // D4
  61: 277.18, // C#4/Db4
  60: 261.63, // C4 (middle C)
  59: 246.94, // B3
  58: 233.08, // A#3/Bb3
  57: 220.00, // A3
  56: 207.65, // G#3/Ab3
  55: 196.00, // G3
  54: 185.00, // F#3/Gb3
  53: 174.61, // F3
  52: 164.81, // E3
  51: 155.56, // D#3/Eb3
  50: 146.83, // D3
  49: 138.59, // C#3/Db3
  48: 130.81, // C3
  47: 123.47, // B2
  46: 116.54, // A#2/Bb2
  45: 110.00, // A2
  44: 103.83, // G#2/Ab2
  43: 98.00, // G2
  42: 92.50, // F#2/Gb2
  41: 87.31, // F2
  40: 82.41, // E2
  39: 77.78, // D#2/Eb2
  38: 73.42, // D2
  37: 69.30, // C#2/Db2
  36: 65.41, // C2
  35: 61.74, //	b1
  34: 58.27, //	A#1/Bb1
  33: 55.00, //	A1
  32: 51.91, //	G#1/Ab1
  31: 49.00, //	G1
  30: 46.25, //	F#1/Gb1
  29: 43.65, //	F1
  28: 41.20, //	E1
  27: 38.89, //	D#1/Eb1
  26: 36.71, //	D1
  25: 34.65, //	C#1/Db1
  24: 32.70, //	C1
  23: 30.87, //	B0
  22: 29.14, //	A#0/Bb0
  21: 27.50, //	A0
  20: 25.96, //
  19: 24.50, //
  18: 23.12, //
  17: 21.83, //
  16: 20.60, //
  15: 19.45, //
  14: 18.35, //
  13: 17.32, //
  12: 16.35, //
  11: 15.43, //
  10: 14.57, //
  9: 13.75, //
  8: 12.98, //
  7: 12.25, //
  6: 11.56, //
  5: 10.91, //
  4: 10.30, //
  3: 9.72, //
  2: 9.18, //
  1: 8.66, //
  0: 8.18, //
};

const getArduinoOutput = (notes) => {
  // const sortedNotes = [...notes].sort((a, b) => {
  //   const diff = a.time - b.time;
  //   if (!diff) {
  //     return b.duration - a.duration
  //   }
  //   return diff;
  // });
  const sortedNotes = notes;

  const notesWithoutOverlap = [];
  sortedNotes.forEach((currentNote) => {
    if (!notesWithoutOverlap.length) {
      notesWithoutOverlap.push(currentNote);
      return;
    }

    const previousNote = notesWithoutOverlap[notesWithoutOverlap.length - 1];
    const previousEnd = previousNote.time + previousNote.duration;
    const currentEnd = currentNote.time + currentNote.duration;

    if (currentNote.time >= previousEnd) {
      // the current note starts after the last note ended
      // so we can play it no problem
      notesWithoutOverlap.push(currentNote);
    } else if (currentEnd > previousEnd) {
      // the current note starts during the previous note
      // but ends after it,
      // so we will start it when the last note ends and keep it's same ending time
      // by shortening its duration
      const augmentedNote = {
        ...currentNote,
        time: previousEnd,
        duration: currentEnd - previousEnd,
      };
      notesWithoutOverlap.push(augmentedNote);
      DEBUG && console.log("AUGMENTING NOTE!", {
        previousNote,
        currentNote,
        augmentedNote,
      });
    } else {
      // the current note starts and ends during the previous note,
      // so we just skip it
      DEBUG && console.log("SKIPPING NOTE!", {
        previousNote,
        currentNote,
      });
    }
  });

  const formattedNotes = notesWithoutOverlap.map((currentNote, idx) => {
    let timeBeforeNextNote = 0;
    const nextNote = notesWithoutOverlap[idx + 1];
    const currentEnd = currentNote.time + currentNote.duration;

    if (nextNote) {
      timeBeforeNextNote = nextNote.time - currentEnd;
    }

    return {
      frequency: midiToFrequency[currentNote.midi],
      duration: currentNote.duration * 1000,
      start: currentNote.time * 1000,
      end: currentEnd * 1000,
      pause: timeBeforeNextNote * 1000,
    };
  });

  formattedNotes.forEach((note, idx, _notes) => {
    if (idx && (_notes[idx - 1].duration + _notes[idx - 1].startTime) > note.startTime) {
      throw new Error(`note starts too early: previous end - ${_notes[idx - 1].duration + _notes[idx - 1].start}, current start - ${note.start}, current end - ${note.start + note.duration}`);
    }
  });
  DEBUG && console.log(JSON.stringify(formattedNotes, null, 2).replace(/"/g, ''));
  const output = `
uint16_t noteFrequencies[] = {${formattedNotes.map(({frequency}) => parseInt(frequency, 10)).join(',')}};
uint16_t noteDurations[] = {${formattedNotes.map(({duration}) => parseInt(duration, 10)).join(',')}};
uint16_t notePauses[] = {${formattedNotes.map(({pause}) => parseInt(pause, 10)).join(',')}};
uint16_t numberOfNotes = ${formattedNotes.length};
  `;
  console.log(output);
}

const midiBlob = fs.readFileSync(process.argv[2], "binary");
const midi = MidiConvert.parse(midiBlob);
console.log(midi.header.name);

const musicTracks = midi.tracks.filter(({instrumentNumber, notes}) => instrumentNumber >= 0 && notes.length);
musicTracks.forEach(({name, notes, instrumentNumber}) => {
  console.log(`\n#${instrumentNumber} - ${name}`);
  getArduinoOutput(notes);
});
