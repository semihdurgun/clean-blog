const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  var perPage = 5;
  var page = req.params.page || 1;

  const posts = await Post.find({})
    .sort({ dateCreated: 'descending' })
    .skip(perPage * page - perPage)
    .limit(perPage);
  res.render('index', {
    posts,
    previous: Number(page) - 1,
    current: Number(page),
    next: Number(page) + 1,
    total: Math.ceil((await Post.estimatedDocumentCount()) / perPage),
  });
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', {
    post,
  });
};

exports.createPost = async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
};

exports.updatePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  post.title = req.body.title;
  post.detail = req.body.detail;
  post.save();
  res.redirect(`/posts/${req.params.id}`);
};

exports.deletePost = async (req, res) => {
  await Post.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
