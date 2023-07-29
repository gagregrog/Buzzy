#include <buzzy.h>

buzzy::buzzy(uint8_t pin) : buzzy(pin, false) {}

buzzy::buzzy(uint8_t pin, bool debug)
{
	_pin = pin;
	_isPlaying = false;
	_noteStartTime = 0;
	_noteEndTime = 0;
	_pauseEndTime = 0;
	_noteEnded = false;
	_songLength = 0;
	_noteIndex = 0;
	_numLoops = 0;
	_loopNum = 0;
	_debug = debug;

	pinMode(_pin, OUTPUT);
}

void buzzy::playSong(note *notes, uint16_t length)
{
	playSong(notes, length, 1);
}

void buzzy::playSong(note *notes, uint16_t length, uint8_t numLoops)
{
	_notes = notes;
	_songLength = length;
	_numLoops = numLoops;
	_loopNum = 0;
	_noteIndex = 0;
	_isPlaying = true;

	if (_debug && _numLoops > 1)
	{
		Serial.print("[BUZZY] Starting Loop ");
		Serial.print(_loopNum + 1);
		Serial.print("/");
		Serial.println(_numLoops);
	}

	_playNote(0);
}

void buzzy::loop(void)
{
	if (!_isPlaying)
	{
		return;
	}

	unsigned long now = millis();

	if (now >= _noteEndTime && !_noteEnded)
	{
		// stop this buzz if we're overdue
		noTone(_pin);
		_noteEnded = true;
	}

	if (now >= _pauseEndTime)
	{
		_noteIndex++;

		if (_noteIndex < _songLength)
		{
			_playNote(_noteIndex);
		}
		else
		{
			_loopNum++;

			if (_loopNum < _numLoops)
			{
				_noteIndex = -1;
				if (_debug && _numLoops > 1)
				{
					Serial.print("[BUZZY] Starting Loop ");
					Serial.print(_loopNum + 1);
					Serial.print("/");
					Serial.println(_numLoops);
				}
			}
			else
			{
				if (_debug)
				{
					Serial.println("[BUZZY] Song finished");
				}
				_isPlaying = false;
			}
		}
	}
}

bool buzzy::isPlaying()
{
	return _isPlaying;
}

void buzzy::_playNote(uint16_t noteIndex)
{
	unsigned long duration = _notes[noteIndex].duration;
	_noteStartTime = millis();
	_noteEndTime = _noteStartTime + duration;
	_pauseEndTime = _noteEndTime + _notes[noteIndex].pause;
	_noteEnded = false;
	tone(_pin, _notes[noteIndex].frequency, duration);
	if (_debug)
	{
		Serial.print("[BUZZY] Playing note: ");
		Serial.print(noteIndex + 1);
		Serial.print("/");
		Serial.println(_songLength);
	}
}
