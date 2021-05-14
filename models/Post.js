const {
    Model,
    Datatypes,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');

// create Post model
// Here, we're using JavaScript's built-in static keyword to indicate that the upvote method is one that's
    // based on the Post model and not an instance method like we used earlier with the User model.
class Post extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}
// replaces the busy code we have in that PUT route now.

// Define the columns in the Post, configure the naming conventions,
// and pass the current connection instance to initialize the Post model.

// create fields/columns for Post model
Post.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isURL: true
        }
    },

    // Using the references property, we establish the relationship between
    // this post and the user by creating a reference to the User model,
    // specifically to the id column that is defined by the key property,
    // which is the primary key. The user_id is conversely defined as the
    // foreign key and will be the matching link.
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    }
}, {
    // these are metadata and naming conventions
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
});

module.exports = Post;

// created_at & updated_at need to be manually added in MySQL Terminal (seed),
//  but not in Sequelize
