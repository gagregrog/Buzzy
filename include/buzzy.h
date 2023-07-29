
#ifndef buzzy_h
#define buzzy_h

#include <Arduino.h>

class buzzy
{
private:
	int _pin;
	int _noteIndex;
	int _songLength;
	uint8_t _loopNum;
	uint8_t _numLoops;

	bool _debug;
	bool _isPlaying;
	bool _noteEnded;

	unsigned long _noteStartTime;
	unsigned long _noteEndTime;
	unsigned long _pauseEndTime;

	int *_frequencies;
	int *_durations;
	int *_pauses;

	void _playNote(int noteIndex);

public:
	buzzy(int pin);
	buzzy(int pin, bool debug);
	void playSong(int *frequencies, int *durations, int *pauses, int length);
	void playSong(int *frequencies, int *durations, int *pauses, int length, uint8_t numLoops);
	void loop(void);
	bool isPlaying();
};

#endif
