module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/WordValidator/': '/',
    "devServer": {
      "proxy": {
        "/api": {
          "target": "http://localhost:3000/"
        }
      }
    }
  }
