# NEU-Automation

```
npm i              :  to install node modules
```

Create .env file with following variables :

```
SENDGRID_API_KEY   :  api key that sendgrid will use to send email
```

```
SENDER_EMAIL       :  email used to create sendgrid api key
```

```
CHROME_BINARY_PATH :  path to chrome binary on your system
```

```
CHROME_DRIVER_PATH :  path to chrome driver on your system
```

Use this command to keep running the script in background on Heroku after deploying :

```
heroku ps:scale worker=1 web=0
```
