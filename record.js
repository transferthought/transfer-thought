const puppeteer = require('puppeteer');
const { promises: fs } = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const savePath = path.resolve('../../recordings');
const downloadPath = path.join(savePath, 'new');

async function convertWebmToMp4(directory, file) {
    const webmFilePath = path.join(directory, file);
    const mp4FilePath = path.join(directory, `${path.basename(file, '.webm')}.mp4`);

    await new Promise((resolve, reject) => {
        ffmpeg(webmFilePath)
            .withSize('393x851')
            // .withFpsInput(60)
            .output(mp4FilePath)
            .on('end', () => {
                console.log(`Converted ${webmFilePath} to ${mp4FilePath}`);
                fs.unlink(webmFilePath);
                resolve(mp4FilePath);
            })
            .on('error', (error) => {
                console.error(`Error converting ${webmFilePath}: ${error.message}`);
                reject(error);
            })
            .run();
    });
}

async function generateRecordings(browser, prompt, count) {
    const array = Array(count).fill(0);
    const pagePromises = array.map(async () => {
        console.log('go to page');
        const page = await browser.newPage();
        await page.setViewport({
            width: 393,
            height: 851,
        });
        //emulate iPhoneX
        // await page.emulate(iPhone);
        await page.goto(`http://localhost:8080/generate/${prompt}`, { waitUntil: 'load', timeout: 0 });
        // await page.goto(`http://localhost:8080/embed/8833b34f-9298-4f67-a51b-853316c97917`, { waitUntil: 'load', timeout: 0 });

        console.log('page loaded...');
        return page;
    });
    const pages = await Promise.all(pagePromises);
    console.log('generating....');
    const recordingPromises = pages.map(async (page) => {
        const title = await page.title();
        await page.waitForSelector('#take-play-btn', { timeout: 0 });
        console.log('preparing client....', title);
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });
        console.log('clicking page....', title);
        await page.bringToFront();
        await page.click('#take-play-btn');
        console.log('playing....', title);

        await page.waitForSelector('#steps-ending', { timeout: 0 });
        console.log('finished....', title);
        return;
    });

    await Promise.all(recordingPromises);
}

(async () => {
    console.log('starting');
    console.log('downloadPath', downloadPath);

    let index = 0;
    const timer = setInterval(() => {
        console.log('Time:', index);
        index += 1;
    }, 1000);
    // const browser = await puppeteer.launch({ headless: 'new', timeout: 120000 });
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=a6f8e6ce-751f-4240-80bb-3c623a77d8f7`,
    });
    const prompt = `2 people from twin peaks talking if they are in a dream or not`;
    await generateRecordings(browser, prompt, 1);
    clearInterval(timer);
    setTimeout(async () => {
        const files = await fs.readdir(downloadPath);
        const newRecording = files.find((f) => path.extname(f) === '.webm');
        const newRecordingData = files.find((f) => path.extname(f) === '.json');

        await convertWebmToMp4(downloadPath, newRecording);
        const recording = `${path.basename(newRecording, '.webm')}.mp4`;
        console.log('recording', recording);
        const name = path.basename(recording, '.mp4');
        console.log(name, path.join(downloadPath, name));
        const newDir = path.join(savePath, name);
        await fs.mkdir(newDir);

        console.log(newDir);
        await fs.rename(path.join(downloadPath, recording), path.join(newDir, `recording.mp4`));
        await fs.rename(path.join(downloadPath, newRecordingData), path.join(newDir, `recording-data.json`));
        browser.close();
    }, 6000);
})();

// recording multiple using multiple browsers
// const browserPromises = [1, 2].map(async () => {
//     const browser = await puppeteer.launch({ headless: 'new', timeout: 120000 });
//     return browser;
// });
// const browsers = await Promise.all(browserPromises);
// await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
// const pagePromises = browsers.map(async (browser) => {
//     console.log('go to page');
//     const page = await browser.newPage();
//     await page.goto('http://localhost:8080/generate/funny%20story%20about%20a%20fish%20fry%20gone%20wrong', { waitUntil: 'load', timeout: 0 });
//     console.log('page loaded...');
//     return page;
// });

// go to site
// check if generation allready exists
// recordings/{prompt}
// if recordings exist (redirect)
// else
//  start recording
