const express = require('express')
const Article = require('./../models/article') // getting the schema
const router = express.Router()
// GET is used to request data from a specified resource.

// GET is one of the most common HTTP methods.


//making a new Article. 
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() }) // I'm accesing 'article' in form fields
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id) //finding the article to edit by id
  res.render('articles/edit', { article: article }) // when the path is matched then the default article will be filled with the previous content on that article
})
 //showing an article by slug. Method will be called when we save our article and redirect 
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})
// whenever we submit the form this method will be called.
router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))
//updating the article
router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))
//deleting the article
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router