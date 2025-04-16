const Post = require('../models/post');



module.exports.index = async(req, res) => {
  const posts = await Post.find({}).populate('author'); 
  res.render('posts/posts',{posts});
};

module.exports.newform = (req, res)=>{
    res.render('posts/new')
  };

  module.exports.createNew = async (req, res) => {
    const { caption, title } = req.body.post;
    
    if (!req.files || req.files.length === 0) {
        req.flash('error', 'At least one image is required');
        return res.redirect('/posts/new');
    }

    const newPost = new Post({ 
        caption, 
        title,
        author: req.user._id,
        images: req.files.map(f => ({ url: f.path, filename: f.filename }))
    });

    await newPost.save();
    req.flash('success', 'Created a new post!');
    res.redirect("/posts");
};

module.exports.editform = (async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('post not found')
        return res.redirect('posts/posts');
    }
    res.render('posts/edit', { post });
  });

module.exports.updatedpost = async (req, res) => {
    const { id } = req.params;
    const { caption, image, title } = req.body.post;
  
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { caption, image, title },
      { new: true }
    );
  
    res.redirect(`/posts/${updatedPost._id}`);
  } 

  module.exports.showpost =  async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author')
        .populate({
            path: 'comments',
            populate: { 
                path: 'author',
                select: 'username email' 
            }
        });
  
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post, currentUser: req.user });
  }

  module.exports.likepost =  async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
  
    if (!post) {
        req.flash('error', 'Post not found.');
        return res.redirect('/posts');
    }
  
    const likeIndex = post.likes.indexOf(req.user._id);
    let liked = false;
  
    if (likeIndex === -1) {
        post.likes.push(req.user._id);
        liked = true;
    } else {
        post.likes.splice(likeIndex, 1);
    }
  
    await post.save();
  
    // Send JSON data for AJAX functionality or redirect for traditional form
    if (req.headers['accept'].includes('application/json')) {
        return res.json({ likesCount: post.likes.length, liked });
    }
  
    res.redirect(`/posts/${id}`);
  }

  module.exports.deletepost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted post');
    res.redirect("/posts");
}