module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/word-validator/': '/', 
    "devServer": {
      "proxy": {
        "/api": {
          "target": "http://localhost:3000/"
        }
      }
    }
  }