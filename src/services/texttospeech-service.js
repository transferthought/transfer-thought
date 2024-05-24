import Client from '@/tt-api';
import md5 from 'md5';

const defaultProviderKey = 'Predictions';

class TextToSpeech {
    static generateFileKey(transcript, voice) {
        return `narrations/${voice}/${md5(transcript)}`;
    }

    static getKeyPath(key) {
        return `${Client.getAssetBase()}/${key}`;
    }

    static async getAudioFile(transcript, voiceString) {
        const [voice, providerKey] = voiceString.split('-');
        try {
            const key = TextToSpeech.generateFileKey(transcript, voice);
            const isFileAvailable = await TextToSpeech.isFileAvailable(key);
            if (isFileAvailable) {
                return TextToSpeech.getKeyPath(key);
            }
            const audioBlob = await TextToSpeech.convertTextToAudio(transcript, voice, providerKey);
            const audioUrl = await TextToSpeech.uploadAudio(key, audioBlob);
            return audioUrl;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async isFileAvailable(key) {
        try {
            const fileUrl = TextToSpeech.getKeyPath(key);
            const result = await fetch(fileUrl, { method: 'HEAD' });
            return result.ok;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async convertTextToAudio(transcript, voice = 'Mathew', providerKey = defaultProviderKey) {
        let textToSpeech;
        if (providerKey === 'ElevenLabs') {
            textToSpeech = await Client.ElevenLabs.textToSpeech(transcript, voice);
        } else {
            const textToSpeechResults = await Client.Predictions.convert({
                textToSpeech: {
                    source: {
                        text: transcript,
                    },
                    voiceId: voice,
                },
            });
            textToSpeech = await fetch(textToSpeechResults.speech.url);
        }
        const audioBlob = await textToSpeech.blob();
        return audioBlob;
    }

    static async uploadAudio(key, blob) {
        const fileType = blob.type;
        await Client.Storage.put(key, blob, {
            contentType: fileType,
        });
        return TextToSpeech.getKeyPath(key);
    }
}

export default TextToSpeech;
