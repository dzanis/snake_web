#ifndef SOUND_H
#define SOUND_H

#include <emscripten.h>
#include <string.h> // for strcmp


void sound_volume(int volume)
{
	EM_ASM({Sound.volume($0)},volume/100.0);
}

void sound_play(char * name)
{
    EM_ASM( {Sound.play(AsciiToString($0))},name );
}

void sound_stop()
{
    EM_ASM(Sound.stop());
}

void sound_pause()
{
     EM_ASM(Sound.pause());
}

void sound_resume()
{
    EM_ASM(Sound.resume());
}

void sound_mute()
{
    EM_ASM(Sound.mute());
}

#endif // SOUND_H
