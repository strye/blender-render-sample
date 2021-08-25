const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
// import puppeteer from "puppeteer";
// import path from "path"
// import fs from 'fs';

// See this article for unning in xfvb
//  https://stackoverflow.com/questions/51883055/running-puppeteer-with-xfvb-headless-false

class PuppeteerRunner {
	static async Test(sitePath) {
		// This is a simple test at the lowest level of interaction with babylon

		// We have chossen to use the Babylon "CreateScreenshotUsingRenderTargetAsync"
		// method over the puppeteer "screenshot" method shown here.
		// This is to maintain better contol over resolution and the ability to use alternative cameras
		const browser = await puppeteer.launch({});
		const page = await browser.newPage();
		//await page.goto("https://playground.babylonjs.com/frame.html#PN1NNI#1");
		await page.goto(path.resolve(sitePath));

		//page.evaluate("console.log('test script inject')");
		await page.screenshot({path: './example.png'});

		browser.close();
	}

	static testinject(msg) { 
		console.log(msg); 
		return msg; 
	}
	

	constructor(pageUrl) {
		this._browser = null;
		this._page = null;
		this._pageUrl = pageUrl;
	}

	async load(sitePath) {
		this._browser = await puppeteer.launch({args: ['--no-sandbox']});
		//this._browser = await puppeteer.launch({executablePath: 'google-chrome-stable'});
		this._page = await this._browser.newPage();

		this._page
		.on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
		.on('pageerror', ({ message }) => console.log(message))
//		.on('response', response => console.log(`${response.status()} ${response.url()}`))
		.on('requestfailed', request => console.log(`${request.failure().errorText} ${request.url()}`))

	
		if (sitePath) this._pageUrl = sitePath;
		let absolutePath = path.resolve(this._pageUrl),
		filePath = `File://${absolutePath}`;
		// console.log(__dirname, this._pageUrl, absolutePath);
		// try {
		// 	if (fs.existsSync(absolutePath)) { console.log(absolutePath+' exists') }
		// } 
		// catch(err) { console.error(err) }

		await this._page.goto(filePath);

		// await this._page.addScriptTag({ path: "./src-inject.js" });
		// await this._page.addScriptTag({ content: `let testMsg = 'test message'; `});
		// await this._page.exposeFunction('testinject', PuppeteerRunner.testinject);
	}
	close() { this._browser.close(); }

	async updateMaterial(side, color) {
		await this._page.evaluate((side, color) => {
			sceneRunner.changeMaterial(side, color);
		}, side, color);
	}

	async updateDesign(designMap) {
		if (designMap) this._designMap = designMap;

		await this._page.evaluate((designMap) => {
			sceneRunner.applyDesign(designMap);
		}, designMap);
	}

	async getRender(fileName, camera = 'main') {
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


module.exports = PuppeteerRunner

//export default PuppeteerRunner;   