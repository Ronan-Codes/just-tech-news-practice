const {
    Model,
    Datatypes,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');

// create Post model
class Post extends Model {

}

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