module.exports = {
	async postOnFacebook(username, password, data, uploadFile = false) {
		var defaultDelay = {
			delay: 30,
		};
		const puppeteer = require('puppeteer');
		const facebook = "https://www.facebook.com/groups/Tradenet.Stocktalks/";
		const browser = await puppeteer.launch({headless: false});
		const context = browser.defaultBrowserContext();
		//so you dont get those annoying allow block popup dialog
		await context.overridePermissions(facebook, ['notifications']);
		const page = await browser.newPage();
		page.setDefaultTimeout(60000);
		await page.goto(facebook, {waitUntil: 'networkidle2' });
		//sign in
		await page.type("input[name='email']", username, defaultDelay);
		await page.type("input[name='pass']", password, defaultDelay);
		await page.evaluate(() => {
			var submitButton = document.querySelector("input[data-testid='royal_login_button']");
			if(submitButton) submitButton.click()
		});
		await page.waitFor(3000);
		await page.goto(facebook, {waitUntil: 'networkidle2' });
		await page.keyboard.press('KeyP');
		await page.keyboard.type(data);
		if(uploadFile){
			const input = await page.$('input[type="file"]');
			await input.uploadFile(uploadFile);
		}
		await page.waitFor(10000);
		await page.evaluate(() => {
			//in the future make this into a function findByText(occurrences, xpath);
			var numberItems = document.evaluate("count(//span[text()='Post'])", document);
			if(numberItems.numberValue != 1){
				throw new Error("Post button returned "+numberItems+ " items");
			}
			var postButton = document.evaluate("//span[text()='Post']",document);
			postButton.iterateNext().click();
		});
		await page.waitFor(10000);
		await page.waitForXPath("//p[text()[contains(.,'Current Streak:')]]");
		await browser.close();
		return;
	}
};