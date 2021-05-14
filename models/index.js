const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote");

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
})
// reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id',
});
// The constraint we impose here is that a post can belong to one user,
// but not many users. Again, we declare the link to the foreign key,
// which is designated at user_id in the Post model.

// ================================
    // Vote Association Begins

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});
// With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each
    // other's information in the context of a vote.

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});
// You may think this will involve a new set of API endpoints at /api/vote, but because a vote belongs to a post,
    //  you'll create a new endpoint at /api/post.

    // Vote Association Ends

module.exports = { User, Post , Vote };

// Model associations are defined here

// To DROP/ADD Table and activate new connections: go to server.js ->
//  in the sync method, change value of {force: false} to true.
