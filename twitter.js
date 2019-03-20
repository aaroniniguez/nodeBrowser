module.exports = {
	postOnTwitter: async function postOnTwitter(username, password, data, uploadFile = false) {
		var defaultDelay = {
			delay: 30,
		};
		const puppeteer = require('puppeteer');
		const twitter = "https://twitter.com/";
		const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();

		await page.goto(twitter, { waitUntil: 'networkidle2' });
		//enter sign in
		await page.evaluate(() => {
			document.getElementsByClassName("js-nav EdgeButton EdgeButton--medium EdgeButton--secondary StaticLoggedOutHomePage-buttonLogin")[0].click();
		});
		await page.waitFor(6000);
		//sign in
		await page.type("input[name='session[username_or_email]']", username, defaultDelay);
		await page.type("input.js-password-field", password, defaultDelay);
		await page.evaluate(() => {
			var submitButton = document.querySelector("button");
			if(submitButton){
				submitButton.click()
			}
		});
		await page.waitFor(6000);
		await page.type("div[name=tweet]", data, defaultDelay);
		if(uploadFile){
			const input = await page.$('input[type="file"]');
			await input.uploadFile(uploadFile);
		}
		await page.waitFor(2000);
		await page.evaluate(() => {
			var submitButton = document.querySelectorAll(".tweet-action.EdgeButton.EdgeButton--primary.js-tweet-btn");
			if(submitButton){
				submitButton[0].click();
			}
		});
		await page.waitFor(2000);
		await browser.close();
		return;
	}
};