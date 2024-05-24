/* eslint-disable max-classes-per-file */
class RecordStream {
    constructor(options) {
        this.stream = options.stream.clone();
        this.handleChunk = options.handleChunk || RecordStream.handleChunk;
        this.recordingInterval = options.recordingInterval || 60000;

        const recordingOptions = { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 250000 };
        this.mediaRecorder = new MediaRecorder(this.stream, recordingOptions);
        this.mediaRecorder.start();
        setInterval(() => {
            // this is a hack so that each recording is a stand alone file
            // without the start and stop method, you have to stich each blob together
            this.mediaRecorder.stop();
        }, this.recordingInterval);
        this.mediaRecorder.ondataavailable = (e) => {
            this.handleChunk(e.data);
            this.mediaRecorder.start();
        };
    }

    static handleChunk(timestamp) {
        console.log('NEW CHUNK: ', timestamp);
    }
}

class RecordingService {
    static startRecording(options) {
        return new RecordStream(options);
    }
}

export default RecordingService;
