const router = require('express').Router();
const {
    Post,
    User,
    Vote,
    Comment
} = require('../../models');

// To use Aggregate function for router.put for upvote
const sequelize = require('../../config/connection');

const withAuth = require('../../utils/auth');


// get all users
router.get('/', (req, res) => {
    Post.findAll({
            attributes: [
              'id',
              'post_url',
              'title',
              'created_at',
              [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
            ],
            // display data in descending order based on `created_at`
            order: [['created_at', 'DESC']],
            // `include` is equivalent to JOIN statement
            include: [
              // include the Comment model here:
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                  model: User,
                  attributes: ['username']
                }
              },
              {
                model: User,
                attributes: ['username']
              }
            ]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// watch video at 13.3.6 to review process of include (JOIN)

router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
              'id',
              'post_url',
              'title',
              'created_at',
              [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']
            ],
            include: [
              {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                  model: User,
                  attributes: ['username']
                }
              },
              {
                model: User,
                attributes: ['username']
              }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id'
                });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// PUT /api/posts/upvote
// An upvote request will differ somewhat from the PUT requests we've created before. It will involve two queries:
  // first, using the Vote model to create a vote, then querying on that post to get an updated vote count.
// router.put('/upvote', (req, res) => {
//   Vote.create({
//     user_id: req.body.user_id,
//     post_id: req.body.post_id
//   })
//     .then(() => {
//       // then find the post we just voted on
//       return Post.findOne({
//         where: {
//           id: req.body.post_id
//         },
//         attributes: [
//           'id',
//           'post_url',
//           'title',
//           'created_at',
//           // use raw MySQL aggregate function query to get a count of how many votes the post has and return it
//             // under the name `vote_count`. Make sure to `const sequelize = require('../../config/connection') above.
//           [
//             sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`),
//             'vote_count'
//           ]
//         ]
//       })
//       .then(dbPostData => res.json(dbPostData))
//       .catch(err => {
//         console.log(err);
//         res.status(400).json(err);
//       })
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => res.json(err));
// })
// Make sure this PUT route is defined before the /:id PUT route, though. Otherwise,
  // Express.js will think the word "upvote" is a valid parameter for /:id.
// Under some circumstances, built-in Sequelize methods can do just that—specifically one called .
  // findAndCountAll(). Unfortunately, because we're counting an associated table's data and not the post itself,
  // that method won't work here.

// Replaces the upvote above
// router.put('/upvote', (req, res) => {
//   // custom static method created in models/Post.js
//   Post.upvote(req.body, { Vote })
//     .then(updatedPostData => res.json(updatedPostData))
//     .catch(err => {
//       console.log(err);
//       res.status(400).json(err);
//     })
// })

// Replaces the upvote above again
router.put('/upvote', withAuth, (req, res) => {
  // make sure the session exists first
  if (req.session) {
    // pass session id along with all destructured properties on req.body
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
          if(!dbPostData) {
              res.status(404).json({ message: `No post found with this id` });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;

// Needs both Post & User to form JOIN, utilizing user_id foreign key
