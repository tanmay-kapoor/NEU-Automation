if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const webdriver = require("selenium-webdriver");
require("chromedriver");
const chrome = require("selenium-webdriver/chrome");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const automate = async () => {
    const options = new chrome.Options();
    options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
    const serviceBuilder = new chrome.ServiceBuilder(
        process.env.CHROME_DRIVER_PATH
    );

    const screen = {
        width: 1920,
        height: 1080,
    };

    // Essential for heroku
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.windowSize(screen);

    const driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(serviceBuilder)
        .build();

    let text = "";

    try {
        await driver.get(
            "https://app.applyyourself.com/AYApplicantLogin/fl_ApplicantConnectLogin.asp?id=neu-grad"
        );
        await driver
            .findElement(webdriver.By.id("ay-login"))
            .sendKeys("tanmaykapoor");
        await driver
            .findElement(webdriver.By.id("ay-password"))
            .sendKeys("Fruitninja!1");
        await driver.findElement(webdriver.By.id("ay-loginSubmit")).click();

        text = await driver
            .findElement(webdriver.By.css(".status > h4"))
            .getText();

        if (text.split(" ")[2] !== "SUBMITTED") {
            text = "Decision is out! All the best boi :)";
        }

        await driver
            .findElement(webdriver.By.css("[href='javascript:logout();']"))
            .click();
    } catch (err) {
        text = err.message;
    } finally {
        driver.quit();
        const message = {
            to: process.env.SENDER_EMAIL,
            from: process.env.SENDER_EMAIL,
            subject: "NEU Application status",
            text,
        };
        sgMail
            .send(message)
            .then(() => {
                setTimeout(automate, 18000000);
            })
            .catch((err) => console.log(err));
    }
};

const foo = async () => {
    await automate();
};

foo();
