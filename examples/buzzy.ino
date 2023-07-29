#include <buzzy.h>
#include <jurassic_park.h>

const int buzzerPin = 10;
buzzy buzzer(buzzerPin);

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  if (!buzzer.isPlaying())
  {
    // see notes within jurassic_park.h
    buzzer.playSong(NOTES(notes));
  }

  buzzer.loop();
  delay(10);
}
