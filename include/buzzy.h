
#ifndef buzzy_h
#define buzzy_h

#include <Arduino.h>

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

	uint16_t *_frequencies;
	uint16_t *_durations;
	uint16_t *_pauses;

	void _playNote(uint16_t noteIndex);

public:
	buzzy(uint8_t pin);
	buzzy(uint8_t pin, bool debug);
	void playSong(uint16_t *frequencies, uint16_t *durations, uint16_t *pauses, uint16_t length);
	void playSong(uint16_t *frequencies, uint16_t *durations, uint16_t *pauses, uint16_t length, uint8_t numLoops);
	void loop(void);
	bool isPlaying();
};

#endif
