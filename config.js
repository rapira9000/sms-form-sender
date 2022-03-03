const port = 3000;
const callbackUrl = `/google/callback`;
const siteDomain = `http://localhost:${port}`;
const googleCallbackURL = `${siteDomain}${callbackUrl}`;

module.exports = {
    port: port,
    googleClientID: "",
    googleClientSecret: "",
    googleCallbackURL,
    urlToSendFromForm: "/"
};