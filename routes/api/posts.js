const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Posts');
const Profile = require('../../models/Profile');

/**
 * @route  POST api/posts
 * @desc   Creo un post.
 * @access private
 */
router.post(
  '/',
  [
    auth,
    [
      check('text', 'El texto es requerido')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Utilizo  el usuario proque desp lo uso en el post.
      const user = await User.findById(req.user.id).select('-password');

      // Lo unico que uso del body es el post. El resto lo traigo.
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.status(200).json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route  GET api/posts
 * @desc   Obtengo los posts.
 * @access private
 */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //Le digo que me traiga los mas recientes con -1;

    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route  GET api/posts/:id
 * @desc   Obtengo un post segun el id
 * @access private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'El post no ha sido encontrado' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'El post no ha sido encontrado' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route  DELETE api/posts/:id
 * @desc   Borro un post
 * @access private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'El post no ha sido encontrado' });
    }

    //Chekeo el usuario
    if (post.user.toString() !== req.user.id) {
      //Hago toString, porque es un objeto y el req.user.id es un string.
      return res
        .status(401)
        .json({ msg: 'No tienes autorizacion para eliminar el post' });
    }

    await post.remove();

    res.status(200).json({ msg: 'El post ha sido eliminado' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'El post no ha sido encontrado' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route  PUT api/posts/like/id
 * @desc   Le doy like a un post
 * @access private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Chekeo si el usuario ya le dio like al post.
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      //El length comprueba que si es mayor a 0, ya tiene el like por el usuario.
      return res.status(400).json({ msg: 'El post ya tiene tu like' });
    }

    //En caso que no lo tenga, lo agrego al array
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route  PUT api/posts/like/id
 * @desc   Le doy unlike a un post
 * @access private
 */
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Chekeo si el usuario ya le dio like al post.
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      //El length comprueba que si es mayor a 0, ya tiene el like por el usuario.
      return res.status(400).json({ msg: 'El post no tiene tu like' });
    }

    //Busco la posicion del like asi desp la borro.
    const removeIndex = post.likes.map(like => {
      like.user.toString().indexOf(req.user.id);
    });

    //Borro ese like con splice.
    post.likes.splice(removeIndex, 1);

    //Guardo el post
    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route  POST api/posts/comment/id
 * @desc   Escribo un comentario en un post.
 * @access private
 */
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'El texto es requerido')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Utilizo  el usuario proque desp lo uso en el post.
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      // Lo unico que uso del body es el post. El resto lo traigo.
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      //Agrego el comentario al principio.
      post.comments.unshift(newComment);

      await post.save();

      res.status(200).json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route  DELETE api/posts/comment/:id/:comment_id
 * @desc   Borro un comentario en un post.
 * @access private
 */

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Busco el comentario primero
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //Compruebo que haya un comentario
    if (!comment) {
      return res.status(404).json({ msg: 'No existe el comentario' });
    }

    //Compruebo que el usuario sea que del comentario
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    //Busco la posicion del comment asi desp la borro.
    const removeIndex = post.comments.map(comment => {
      comment.user.toString().indexOf(req.user.id);
    });

    //Borro ese like con splice.
    post.comments.splice(removeIndex, 1);

    //Guardo el post
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
