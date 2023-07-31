
#ifndef buzzy_h
#define buzzy_h

#include <Arduino.h>

typedef struct note
{
	uint16_t frequency;
	uint16_t duration;
	uint16_t pause;
} note;

template <typename T>
void PROGMEM_read(const T *source, T &destination)
{
	memcpy_P(&destination, source, sizeof(T));
}

template <typename T, size_t N>
size_t ArraySize(T (&)[N]) { return N; }

#define NOTES(notes) notes, ArraySize(notes)

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

	const note *_notes;

	void _playNote(uint16_t noteIndex);

public:
	buzzy(uint8_t pin);
	buzzy(uint8_t pin, bool debug);
	void playSong(const note *notes, uint16_t length);
	void playSong(const note *notes, uint16_t length, uint8_t numLoops);
	void loop(void);
	bool isPlaying();
	void stop();
	void pause();
};

#endif
