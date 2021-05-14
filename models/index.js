const User = require("./User");
const Post = require("./Post")

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

module.exports = { User, Post };

// Model associations are defined here

// To DROP/ADD Table and activate new connections: go to server.js ->
//  in the sync method, change value of {force: false} to true.
