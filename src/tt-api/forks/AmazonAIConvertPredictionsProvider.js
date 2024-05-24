/* eslint-disable */
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { Credentials, ConsoleLogger as Logger, Signer, getAmplifyUserAgent } from '@aws-amplify/core';
import { EventStreamMarshaller } from '@aws-sdk/eventstream-marshaller';
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node';
import { isBytesSource } from '@aws-amplify/predictions/lib-esm/types';
import { AbstractConvertPredictionsProvider } from '@aws-amplify/predictions/lib-esm/types/Providers/AbstractConvertPredictionsProvider';

const __extends =
    (this && this.__extends) ||
    (function() {
        var extendStatics = function(d, b) {
            extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function(d, b) {
                        d.__proto__ = b;
                    }) ||
                function(d, b) {
                    for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                };
            return extendStatics(d, b);
        };
        return function(d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
        };
    })();
const __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P((resolve) => {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))((resolve, reject) => {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const __generator =
    (this && this.__generator) ||
    function(thisArg, body) {
        let _ = {
            label: 0,
            sent() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: [],
        };
        let f;
        let y;
        let t;
        let g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function() {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function(v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.');
            while (_) {
                try {
                    if (
                        ((f = 1),
                        y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

const logger = new Logger('AmazonAIConvertPredictionsProvider');
const eventBuilder = new EventStreamMarshaller(toUtf8, fromUtf8);
const AmazonAIConvertPredictionsProvider = /** @class */ (function(_super) {
    __extends(AmazonAIConvertPredictionsProvider, _super);
    function AmazonAIConvertPredictionsProvider() {
        const _this = _super.call(this) || this;
        _this.inputSampleRate = 44100;
        _this.outputSampleRate = 16000;
        return _this;
    }
    AmazonAIConvertPredictionsProvider.prototype.getProviderName = function() {
        return 'AmazonAIConvertPredictionsProvider';
    };
    AmazonAIConvertPredictionsProvider.prototype.translateText = function(input) {
        return __awaiter(this, void 0, void 0, function() {
            let _a;
            let _b;
            let _c;
            let _d;
            let _e;
            let sourceLanguage;
            let _f;
            let targetLanguage;
            let _g;
            let region;
            let credentials;
            let sourceLanguageCode;
            let targetLanguageCode;
            let translateTextCommand;
            let data;
            let err_1;
            return __generator(this, function(_h) {
                switch (_h.label) {
                    case 0:
                        logger.debug('Starting translation');
                        (_a = this._config.translateText),
                            (_b = _a === void 0 ? {} : _a),
                            (_c = _b.defaults),
                            (_d = _c === void 0 ? {} : _c),
                            (_e = _d.sourceLanguage),
                            (sourceLanguage = _e === void 0 ? '' : _e),
                            (_f = _d.targetLanguage),
                            (targetLanguage = _f === void 0 ? '' : _f),
                            (_g = _b.region),
                            (region = _g === void 0 ? '' : _g);
                        if (!region) {
                            return [2 /* return */, Promise.reject('region not configured for transcription')];
                        }
                        return [4 /* yield */, Credentials.get()];
                    case 1:
                        credentials = _h.sent();
                        if (!credentials) {
                            return [2 /* return */, Promise.reject('No credentials')];
                        }
                        sourceLanguageCode = input.translateText.source.language || sourceLanguage;
                        targetLanguageCode = input.translateText.targetLanguage || targetLanguage;
                        if (!sourceLanguageCode || !targetLanguageCode) {
                            return [2 /* return */, Promise.reject('Please provide both source and target language')];
                        }
                        this.translateClient = new TranslateClient({
                            region,
                            credentials,
                            customUserAgent: getAmplifyUserAgent(),
                        });
                        translateTextCommand = new TranslateTextCommand({
                            SourceLanguageCode: sourceLanguageCode,
                            TargetLanguageCode: targetLanguageCode,
                            Text: input.translateText.source.text,
                        });
                        _h.label = 2;
                    case 2:
                        _h.trys.push([2, 4, , 5]);
                        return [4 /* yield */, this.translateClient.send(translateTextCommand)];
                    case 3:
                        data = _h.sent();
                        return [
                            2 /* return */,
                            {
                                text: data.TranslatedText,
                                language: data.TargetLanguageCode,
                            },
                        ];
                    case 4:
                        err_1 = _h.sent();
                        return [2 /* return */, Promise.reject(err_1)];
                    case 5:
                        return [2];
                }
            });
        });
    };
    AmazonAIConvertPredictionsProvider.prototype.convertTextToSpeech = function(input) {
        return __awaiter(this, void 0, void 0, function() {
            let credentials;
            let _a;
            let _b;
            let _c;
            let _d;
            let VoiceId;
            let _e;
            let region;
            let voiceId;
            let synthesizeSpeechCommand;
            let data;
            let response;
            let arrayBuffer;
            let blob;
            let url;
            let err_2;
            return __generator(this, function(_f) {
                switch (_f.label) {
                    case 0:
                        return [4 /* yield */, Credentials.get()];
                    case 1:
                        credentials = _f.sent();
                        if (!credentials) {
                            return [2 /* return */, Promise.reject('No credentials')];
                        }
                        (_a = this._config.speechGenerator),
                            (_b = _a === void 0 ? {} : _a),
                            (_c = _b.defaults),
                            (_d = (_c === void 0 ? {} : _c).VoiceId),
                            (VoiceId = _d === void 0 ? '' : _d),
                            (_e = _b.region),
                            (region = _e === void 0 ? '' : _e);
                        if (!input.textToSpeech.source) {
                            return [2 /* return */, Promise.reject('Source needs to be provided in the input')];
                        }
                        voiceId = input.textToSpeech.voiceId || VoiceId;
                        if (!region) {
                            return [2 /* return */, Promise.reject('Region was undefined. Did you enable speech generator using amplify CLI?')];
                        }
                        if (!voiceId) {
                            return [2 /* return */, Promise.reject('VoiceId was undefined.')];
                        }
                        this.pollyClient = new PollyClient({
                            region,
                            credentials,
                            customUserAgent: getAmplifyUserAgent(),
                        });
                        synthesizeSpeechCommand = new SynthesizeSpeechCommand({
                            OutputFormat: 'mp3',
                            Text: input.textToSpeech.source.text,
                            VoiceId: voiceId,
                            TextType: 'text',
                            SampleRate: '24000',
                            Engine: 'neural',
                        });
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 5, , 6]);
                        return [4 /* yield */, this.pollyClient.send(synthesizeSpeechCommand)];
                    case 3:
                        data = _f.sent();
                        response = new Response(data.AudioStream);
                        return [4 /* yield */, response.arrayBuffer()];
                    case 4:
                        arrayBuffer = _f.sent();
                        blob = new Blob([arrayBuffer], {
                            type: data.ContentType,
                        });
                        url = URL.createObjectURL(blob);
                        return [
                            2 /* return */,
                            {
                                speech: { url },
                                audioStream: arrayBuffer,
                                text: input.textToSpeech.source.text,
                            },
                        ];
                    case 5:
                        err_2 = _f.sent();
                        return [2 /* return */, Promise.reject(err_2)];
                    case 6:
                        return [2];
                }
            });
        });
    };
    AmazonAIConvertPredictionsProvider.prototype.convertSpeechToText = function(input) {
        return __awaiter(this, void 0, void 0, function() {
            let credentials;
            let _a;
            let _b;
            let _c;
            let _d;
            let languageCode;
            let _e;
            let region;
            let _f;
            let source;
            let _g;
            let language;
            let connection;
            let fullText;
            let err_3;
            let err_4;
            return __generator(this, function(_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 7, , 8]);
                        logger.debug('starting transcription..');
                        return [4 /* yield */, Credentials.get()];
                    case 1:
                        credentials = _h.sent();
                        if (!credentials) {
                            return [2 /* return */, Promise.reject('No credentials')];
                        }
                        (_a = this._config.transcription),
                            (_b = _a === void 0 ? {} : _a),
                            (_c = _b.defaults),
                            (_d = (_c === void 0 ? {} : _c).language),
                            (languageCode = _d === void 0 ? '' : _d),
                            (_e = _b.region),
                            (region = _e === void 0 ? '' : _e);
                        if (!region) {
                            return [2 /* return */, Promise.reject('region not configured for transcription')];
                        }
                        if (!languageCode) {
                            return [2 /* return */, Promise.reject('languageCode not configured or provided for transcription')];
                        }
                        (_f = input.transcription), (source = _f.source), (_g = _f.language), (language = _g === void 0 ? languageCode : _g);
                        if (!isBytesSource(source)) return [3 /* break */, 6];
                        return [
                            4 /* yield */,
                            this.openConnectionWithTranscribe({
                                credentials,
                                region,
                                languageCode: language,
                            }),
                        ];
                    case 2:
                        connection = _h.sent();
                        _h.label = 3;
                    case 3:
                        _h.trys.push([3, 5, , 6]);
                        return [
                            4 /* yield */,
                            this.sendDataToTranscribe({
                                connection,
                                raw: source.bytes,
                            }),
                        ];
                    case 4:
                        fullText = _h.sent();
                        return [
                            2 /* return */,
                            {
                                transcription: {
                                    fullText,
                                },
                            },
                        ];
                    case 5:
                        err_3 = _h.sent();
                        Promise.reject(err_3);
                        return [3 /* break */, 6];
                    case 6:
                        return [2 /* return */, Promise.reject('Source types other than byte source are not supported.')];
                    case 7:
                        err_4 = _h.sent();
                        return [2 /* return */, Promise.reject(`${err_4.name}: ${err_4.message}`)];
                    case 8:
                        return [2];
                }
            });
        });
    };
    AmazonAIConvertPredictionsProvider.serializeDataFromTranscribe = function(message) {
        let decodedMessage = '';
        const transcribeMessage = eventBuilder.unmarshall(Buffer.from(message.data));
        const transcribeMessageJson = JSON.parse(String.fromCharCode.apply(String, transcribeMessage.body));
        if (transcribeMessage.headers[':message-type'].value === 'exception') {
            logger.debug('exception', JSON.stringify(transcribeMessageJson.Message, null, 2));
            throw new Error(transcribeMessageJson.Message);
        } else if (transcribeMessage.headers[':message-type'].value === 'event') {
            if (transcribeMessageJson.Transcript.Results.length > 0) {
                if (transcribeMessageJson.Transcript.Results[0].Alternatives.length > 0) {
                    if (transcribeMessageJson.Transcript.Results[0].Alternatives[0].Transcript.length > 0) {
                        if (transcribeMessageJson.Transcript.Results[0].IsPartial === false) {
                            decodedMessage = `${transcribeMessageJson.Transcript.Results[0].Alternatives[0].Transcript}\n`;
                            logger.debug({ decodedMessage });
                        } else {
                            logger.debug({
                                transcript: transcribeMessageJson.Transcript.Results[0].Alternatives[0],
                            });
                        }
                    }
                }
            }
        }
        return decodedMessage;
    };
    AmazonAIConvertPredictionsProvider.prototype.sendDataToTranscribe = function(_a) {
        const _this = this;
        const { connection } = _a;
        const { raw } = _a;
        return new Promise((res, rej) => {
            let fullText = '';
            connection.onmessage = function(message) {
                try {
                    const decodedMessage = AmazonAIConvertPredictionsProvider.serializeDataFromTranscribe(message);
                    if (decodedMessage) {
                        fullText += `${decodedMessage} `;
                    }
                } catch (err) {
                    logger.debug(err);
                    rej(err.message);
                }
            };
            connection.onerror = function(errorEvent) {
                logger.debug({ errorEvent });
                rej('failed to transcribe, network error');
            };
            connection.onclose = function(closeEvent) {
                logger.debug({ closeEvent });
                return res(fullText.trim());
            };
            logger.debug({ raw });
            if (Array.isArray(raw)) {
                for (let i = 0; i < raw.length - 1023; i += 1024) {
                    const data = raw.slice(i, i + 1024);
                    _this.sendEncodedDataToTranscribe(connection, data);
                }
            }
            // sending end frame
            const endFrameEventMessage = _this.getAudioEventMessage(Buffer.from([]));
            const endFrameBinary = eventBuilder.marshall(endFrameEventMessage);
            connection.send(endFrameBinary);
        });
    };
    AmazonAIConvertPredictionsProvider.prototype.sendEncodedDataToTranscribe = function(connection, data) {
        const downsampledBuffer = this.downsampleBuffer({ buffer: data });
        const pcmEncodedBuffer = this.pcmEncode(downsampledBuffer);
        const audioEventMessage = this.getAudioEventMessage(Buffer.from(pcmEncodedBuffer));
        const binary = eventBuilder.marshall(audioEventMessage);
        connection.send(binary);
    };
    AmazonAIConvertPredictionsProvider.prototype.getAudioEventMessage = function(buffer) {
        const audioEventMessage = {
            body: buffer,
            headers: {
                ':message-type': {
                    type: 'string',
                    value: 'event',
                },
                ':event-type': {
                    type: 'string',
                    value: 'AudioEvent',
                },
            },
        };
        return audioEventMessage;
    };
    AmazonAIConvertPredictionsProvider.prototype.pcmEncode = function(input) {
        let offset = 0;
        const buffer = new ArrayBuffer(input.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return buffer;
    };
    AmazonAIConvertPredictionsProvider.prototype.downsampleBuffer = function(_a) {
        const { buffer } = _a;
        if (this.outputSampleRate === this.inputSampleRate) {
            return buffer;
        }
        const sampleRateRatio = this.inputSampleRate / this.outputSampleRate;
        const newLength = Math.round(buffer.length / sampleRateRatio);
        const result = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult < result.length) {
            const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            let accum = 0;
            let count = 0;
            for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    };
    AmazonAIConvertPredictionsProvider.prototype.openConnectionWithTranscribe = function(_a) {
        const _this = this;
        const userCredentials = _a.credentials;
        const { region } = _a;
        const { languageCode } = _a;
        return new Promise((res, rej) =>
            __awaiter(_this, void 0, void 0, function() {
                let access_key;
                let secret_key;
                let session_token;
                let credentials;
                let signedUrl;
                let connection;
                return __generator(this, function(_a) {
                    (access_key = userCredentials.accessKeyId), (secret_key = userCredentials.secretAccessKey), (session_token = userCredentials.sessionToken);
                    credentials = {
                        access_key,
                        secret_key,
                        session_token,
                    };
                    signedUrl = this.generateTranscribeUrl({
                        credentials,
                        region,
                        languageCode,
                    });
                    logger.debug('connecting...');
                    connection = new WebSocket(signedUrl);
                    connection.binaryType = 'arraybuffer';
                    connection.onopen = function() {
                        logger.debug('connected');
                        res(connection);
                    };
                    return [2];
                });
            })
        );
    };
    AmazonAIConvertPredictionsProvider.prototype.generateTranscribeUrl = function(_a) {
        const { credentials } = _a;
        const { region } = _a;
        const { languageCode } = _a;
        const url = [
            `wss://transcribestreaming.${region}.amazonaws.com:8443`,
            '/stream-transcription-websocket?',
            'media-encoding=pcm&',
            'sample-rate=16000&',
            `language-code=${languageCode}`,
        ].join('');
        const signedUrl = Signer.signUrl(url, credentials, { region, service: 'transcribe' }, 300);
        return signedUrl;
    };
    return AmazonAIConvertPredictionsProvider;
})(AbstractConvertPredictionsProvider);
export { AmazonAIConvertPredictionsProvider };
/**
 * @deprecated use named import
 */
export default AmazonAIConvertPredictionsProvider;
// # sourceMappingURL=AmazonAIConvertPredictionsProvider.js.map
