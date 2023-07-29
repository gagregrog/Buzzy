
#ifndef buzzy_h
#define buzzy_h

#include <Arduino.h>

typedef struct note
{
	uint16_t frequency;
	uint16_t duration;
	uint16_t pause;
};

#define NOTES(notes) notes, sizeof(notes) / sizeof(note)

class buzzy
{
private:
	uint8_t _pin;
	uint16_t _noteIndex;
	uint16_t _songLength;
	uint8_t _loopNum;
	uint8_t _numLoops;

	bool _debug;
	bool _isPlaying;
	bool _noteEnded;

	unsigned long _noteStartTime;
	unsigned long _noteEndTime;
	unsigned long _pauseEndTime;

	note *_notes;

	void _playNote(uint16_t noteIndex);

public:
	buzzy(uint8_t pin);
	buzzy(uint8_t pin, bool debug);
	void playSong(note *notes, uint16_t length);
	void playSong(note *frequencies, uint16_t length, uint8_t numLoops);
	void loop(void);
	bool isPlaying();
};

#endif
