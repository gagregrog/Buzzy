#include <buzzy.h>

buzzy::buzzy(int pin): buzzy(pin, false) {}

buzzy::buzzy(int pin, bool debug) {
	_pin           = pin;
	_isPlaying     = false;
	_noteStartTime = 0;
	_noteEndTime   = 0;
	_pauseEndTime  = 0;
	_noteEnded     = false;
	_songLength    = 0;
	_noteIndex     = 0;
	_numLoops      = 0;
	_loopNum       = 0;
	_debug         = debug;

	pinMode(_pin, OUTPUT);
}

void buzzy::playSong(int *frequencies, int *durations, int *pauses, int length) {
	playSong(frequencies, durations, pauses, length, 1);
}

void buzzy::playSong(int *frequencies, int *durations, int *pauses, int length, uint8_t numLoops) {
	_frequencies = frequencies;
	_durations   = durations;
	_pauses      = pauses;
	_songLength  = length;
	_numLoops    = numLoops;
	_loopNum     = 0;
	_noteIndex   = 0;
	_isPlaying = true;

	if (_debug && _numLoops > 1) {
		Serial.print("[BUZZY] Starting Loop ");
		Serial.print(_loopNum + 1);
		Serial.print("/");
		Serial.println(_numLoops);
	}

	_playNote(0);
}

void buzzy::loop(void) {
	if (!_isPlaying) {
		return;
	}

	unsigned long now = millis();

	if (now >= _noteEndTime && !_noteEnded) {
		// stop this buzz if we're overdue
		noTone(_pin);
		_noteEnded = true;
	}

	if (now >= _pauseEndTime) {
		_noteIndex++;

		if (_noteIndex < _songLength) {
			_playNote(_noteIndex);
		} else {
			_loopNum++;

			if (_loopNum < _numLoops) {
				_noteIndex = -1;
				if (_debug && _numLoops > 1) {
					Serial.print("[BUZZY] Starting Loop ");
					Serial.print(_loopNum + 1);
					Serial.print("/");
					Serial.println(_numLoops);
				}
			} else {
				if (_debug) {
					Serial.println("[BUZZY] Song finished");
				}
				_isPlaying = false;
			}
		}
	}
}

bool buzzy::isPlaying() {
	return _isPlaying;
}

void buzzy::_playNote(int noteIndex) {
	unsigned long duration = _durations[noteIndex];
	_noteStartTime = millis();
	_noteEndTime = _noteStartTime + duration;
	_pauseEndTime = _noteEndTime + _pauses[noteIndex];
	_noteEnded = false;
	tone(_pin, _frequencies[noteIndex], duration);
	if (_debug) {
		Serial.print("[BUZZY] Playing note: ");
		Serial.print(noteIndex + 1);
		Serial.print("/");
		Serial.println(_songLength);
	}
}
