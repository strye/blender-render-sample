const chromium = require('chrome-aws-lambda');
const _ = require('lodash');
const BABYLON = require('@babylonjs/core')

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    // browser = await chromium.puppeteer.launch({
	// 	args: chromium.args,
	// 	defaultViewport: chromium.defaultViewport,
	// 	executablePath: await chromium.executablePath,
	// 	headless: chromium.headless,
	// 	ignoreHTTPSErrors: true,
    // });
    // let page = await browser.newPage();
    // await page.goto(event.url || 'https://example.com');
    // result = await page.title();

	const renderer = new PuppeteerRunner(`./models/${event.model.name}`);


	await renderer.load();
	//await renderer.updateMaterial("top", "red")
	//await renderer.updateMaterial("front", "green")
	await renderer.updateDesign(designMap);
	
	
	// await renderer.getRender('./example.png');
	await renderer.getRender('./images/example1.png', 'camera1');
	await renderer.getRender('./images/example2.png', 'camera2');
	await renderer.getRender('./images/example3.png', 'camera3');
	await renderer.getRender('./images/example4.png', 'camera4');
	await renderer.getRender('./images/example5.png', 'camera5');
	
	renderer.close();



	} catch (error) {
		return callback(error);
	} finally {
		if (browser !== null) {
			await browser.close();
		}
	}

	return callback(null, result);
};


class PuppeteerRunner {
	constructor(pageUrl) {
		this._browser = null;
		this._page = null;
		this._pageUrl = pageUrl;
	}

	async load(sitePath) {
		this._browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});
	
		this._page = await this._browser.newPage();

		this._page
		.on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
		.on('pageerror', ({ message }) => console.log(message))
		.on('requestfailed', request => console.log(`${request.failure().errorText} ${request.url()}`))

		if (sitePath) this._pageUrl = sitePath;
		let absolutePath = path.resolve(this._pageUrl),
		filePath = `File://${absolutePath}`;

		await this._page.goto(filePath);
	}
	close() { this._browser.close(); }

	async applyDesign(designMap) {
		if (designMap) this._designMap = designMap;

		await this._page.evaluate((designMap) => {
			sceneRunner.applyDesign(designMap);
		}, designMap);
	}

	async renderImages(imageSpec, fileName, camera = 'main') {
		let imgData = await this._page.evaluate(async (camera) => {
			//return await PupRender();
			return await sceneRunner.renderCamera(camera);
		}, camera);
		
		let base64Data = imgData.replace(/^data:image\/png;base64,/, "");

		// Delete files if they exists
		try { fs.unlinkSync(fileName) } 
		catch (e) { if (!e.errno === -2) console.log(e) }
		fs.writeFileSync(fileName, base64Data, 'base64');
	}


}
