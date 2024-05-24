const { promises: fs } = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const inputDirectory = '../../recordings/2 people from twin peaks talking if they are in a dream or not';
const recordingData = require(`${inputDirectory}/recording-data.json`);
const inputFilePath = path.resolve(`${inputDirectory}/recording.mp4`);

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true; // File exists
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false; // File does not exist
        } else {
            throw error; // Other error occurred
        }
    }
}
// Cut the MP4 file into segments
const split = async (inputFilePath, recordingData) => {
    const promises = [];
    // Cut the MP4 file into segments
    for (let i = 0; i < recordingData.segments.length; i++) {
        const promise = new Promise((resolve) => {
            const currentSegment = recordingData.segments[i];
            const nextSegment = recordingData.segments[i + 1] || null; // Use the next start time as end time, or null for the last segment
            const outputPattern = `%d-${currentSegment.name}.mp4`; // Will generate output-1.mp4, output-2.mp4, ...
            const outputFilePath = `${inputDirectory}/original-split-clips/${outputPattern.replace('%d', i)}`;

            const ffmpegCommand = ffmpeg(inputFilePath)
                .setStartTime(currentSegment.start)
                .output(outputFilePath);

            if (nextSegment !== null) {
                ffmpegCommand.setDuration(currentSegment.duration);
            }

            ffmpegCommand
                .on('end', () => {
                    console.log(`Segment ${i + 1} successfully generated.`);
                    resolve();
                })
                .run();
        });
        promises.push(promise);
    }
    return Promise.all(promises);
};

const merge = (recordingData) => {
    const promises = [];
    const groupedSegments = recordingData.segments.reduce((groups, segment) => {
        const pattern = segment.name;
        if (!groups[pattern]) {
            groups[pattern] = [];
        }
        groups[pattern].push(segment);
        return groups;
    }, {});

    // Process and combine segments for each pattern
    Object.entries(groupedSegments).forEach(([name, segments]) => {
        const videoNames = [];

        for (let i = 0; i < recordingData.segments.length; i++) {
            const currentSegment = recordingData.segments[i];
            if (currentSegment.name === name) {
                const outputPattern = `%d-${currentSegment.name}.mp4`; // Will generate output-1.mp4, output-2.mp4, ...
                const outputFilePath = `${inputDirectory}/original-split-clips/${outputPattern.replace('%d', i)}`;
                videoNames.push(outputFilePath);
            }
        }
        console.log(videoNames);
        let mergedVideo = ffmpeg();
        videoNames.forEach(function(videoName) {
            mergedVideo = mergedVideo.addInput(videoName);
        });

        const promise = new Promise((resolve) => {
            mergedVideo
                .on('error', function(err) {
                    console.log('An error occurred: ' + err.message);
                })
                .on('end', function() {
                    console.log('Merging finished !');
                    resolve();
                });
            const outputFilePath = `${inputDirectory}/original-split-clips-merged/${name}.mp4`;
            mergedVideo.mergeToFile(outputFilePath, `./tmp/`);
        });
        promises.push(promise);
    });
    return Promise.all(promises);
};

const splitMerge = (recordingData, mergedClipsDirectoryName = 'original-split-clips-merged') => {
    const promises = [];
    const groupedSegments = recordingData.segments.reduce((groups, segment, index) => {
        const pattern = segment.name;
        if (!groups[pattern]) {
            groups[pattern] = [];
        }
        const groupedSegments = groups[pattern];
        const previousSegment = groupedSegments[groupedSegments.length - 1] || null;
        console.log(groupedSegments);
        const newSegment = { ...segment };
        if (previousSegment) {
            console.log(previousSegment);
            newSegment.start = previousSegment.start + previousSegment.duration;
        } else {
            newSegment.start = 0;
        }
        groups[pattern].push(newSegment);
        return groups;
    }, {});

    // Process and combine segments for each pattern
    Object.entries(groupedSegments).forEach(([name, segments]) => {
        for (let i = 0; i < segments.length; i++) {
            const currentSegment = segments[i];
            const nextSegment = segments[i + 1] || null; // Use the next start time as end time, or null for the last segment
            const outputPattern = `%d-${currentSegment.name}.mp4`; // Will generate output-1.mp4, output-2.mp4, ...
            const outputFilePath = `${inputDirectory}/merged-clips-split/${outputPattern.replace('%d', currentSegment.index)}`;

            const mergedClipPath = `${inputDirectory}/${mergedClipsDirectoryName}/${name}.mp4`;
            const ffmpegCommand = ffmpeg(mergedClipPath)
                .setStartTime(currentSegment.start)
                .output(outputFilePath);

            if (nextSegment !== null) {
                ffmpegCommand.setDuration(currentSegment.duration);
            }

            const promise = new Promise((resolve) => {
                ffmpegCommand
                    .on('error', function(err) {
                        console.log('An error occurred: ' + err.message);
                    })
                    .on('end', () => {
                        console.log(`Segment ${i + 1} successfully generated.`);
                        resolve();
                    })
                    .run();
            });
            promises.push(promise);
        }
    });
    return Promise.all(promises);
};

const completeMerge = (recordingData) => {
    return new Promise((resolve) => {
        let mergedVideo = ffmpeg();
        for (let i = 0; i < recordingData.segments.length; i++) {
            const currentSegment = recordingData.segments[i];
            const outputPattern = `%d-${currentSegment.name}.mp4`;
            const segmentClipPath = `${inputDirectory}/merged-clips-split/${outputPattern.replace('%d', i)}`;
            console.log(segmentClipPath);
            mergedVideo = mergedVideo.addInput(segmentClipPath);
        }
        console.log('test');
        mergedVideo
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log('Merging finished !');
                resolve();
            });
        const outputFilePath = `${inputDirectory}/complete.mp4`;
        console.log(outputFilePath);
        mergedVideo.mergeToFile(outputFilePath, `./tmp/`);
    });
};

recordingData.segments = recordingData.segments.map((segment, index) => {
    const nextSegment = recordingData.segments[index + 1] || null;
    const duration = nextSegment ? nextSegment.start - segment.start : null;
    return {
        ...segment,
        index,
        duration,
    };
});
async () => {};

async function runSplit() {
    // creating folders
    const mkdirPromises = ['merged-clips-split', 'merged-clips-style-transfer', 'original-split-clips', 'original-split-clips-merged'].map(async (dirName) => {
        const newDir = path.join(inputDirectory, dirName);

        if (!(await checkFileExists(newDir))) {
            await fs.mkdir(newDir);
        }
    });
    await Promise.all(mkdirPromises);

    console.log('starting split');
    await split(inputFilePath, recordingData);
    console.log('finished split');

    console.log('starting merge');
    await merge(recordingData);
    console.log('finished merge');
}

async function runMerge() {
    console.log('starting split merge');
    // await splitMerge(recordingData);
    await splitMerge(recordingData, 'merged-clips-style-transfer');
    console.log('finished split merge');

    console.log('starting complete merge');
    await completeMerge(recordingData);
    console.log('finished merge');
}

async function run() {
    // await runSplit();
    await runMerge();
}
run();
