module.exports = (app) => {
  app.get('/', renderReact)

  function renderReact (req,res,next){
    res.sendFile('index.html')
  }
}
