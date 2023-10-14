module.exports = {
  API_URL: process.env.NODE_ENV === "production" ? "https://cyproteckapi.azurewebsites.net" : "http://localhost:3000",
  google: {
    API_KEY: "",
    CLIENT_ID: "23144678283-oek7ncjmmrgkgmi2i56sc411gp71a8sp.apps.googleusercontent.com",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
}
