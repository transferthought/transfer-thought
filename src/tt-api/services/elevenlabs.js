const elevenLabsAPIKey = 'ELEVEN_LABS_API_KEY';
class ElevenLabs {
    constructor(url) {
        this.url = url;
        this.voices = [
            {
                voice_id: '21m00Tcm4TlvDq8ikWAM',
                name: 'Rachel',
            },
            {
                voice_id: 'AZnzlk1XvdvUeBnXmlld',
                name: 'Domi',
            },
            {
                voice_id: 'ErXwobaYiN019PkySvjV',
                name: 'Antoni',
            },
            {
                voice_id: 'MF3mGyEYCl7XYWbV9V6O',
                name: 'Elli',
            },
            {
                voice_id: 'TxGEqnHWrfWFTfGW9XjX',
                name: 'Josh',
            },
            {
                voice_id: 'VR6AewLTigWG4xSOukaG',
                name: 'Arnold',
            },
            {
                voice_id: 'pNInz6obpgDQGcFmaJgB',
                name: 'Adam',
            },
            {
                voice_id: 'yoZ06aMxZJJ28mfd3POQ',
                name: 'Sam',
            },
        ];
        this.fetchVoices();
    }
    async fetchVoices() {
        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/voices`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'xi-api-key': elevenLabsAPIKey,
                },
            });
            const responseData = await response.json();
            if (responseData.voices) {
                this.voices = responseData.voices;
            }
        } catch (err) {
            console.log(err);
        }
    }
    getVoiceByName(name) {
        return this.voices.find((voice) => voice.name === name);
    }
    async textToSpeech(transcript, name, maxRetries = 5, retryDelay = 5000) {
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const voice = this.getVoiceByName(name);
                const messages = {
                    text: transcript,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0,
                    },
                };

                const textToSpeech = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'xi-api-key': elevenLabsAPIKey,
                    },
                    body: JSON.stringify(messages),
                });

                console.log(textToSpeech, 'elevenlabs ok');
                if (textToSpeech.ok) {
                    console.log('elevenlabs ok');
                    return textToSpeech;
                } else {
                    console.log('elevenlabs retry');
                    retryCount++;
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
            } catch (error) {
                console.log(error, 'elevenlabs retry');
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }

        throw new Error(`Text-to-speech request failed after ${maxRetries} retries.`);
    }
}

export default new ElevenLabs('https://api.elevenlabs.io/v1/text-to-speech');
