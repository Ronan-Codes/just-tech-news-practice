const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model 
class User extends Model {}

// definte table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS GO HERE
        // define an id column
        id: {
            // use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true 
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column 
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through data validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
                // Replaced by async/await function 
                // set up beforeCreate lifecycle "hook" functionality
            // beforeCreate(userData) {
            //     return bcrypt.hash(userData.password, 10).then(newUserData => {
            //         return newUserData
            //     });
            // }

            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;

            // Before we can check to see if this hook is effective however, we must add an option to the query call.
                // we will need to add the option { individualHooks: true }.
            // Navigate to the query call in the user-routes.js file for the User.update function in the PUT route to update the password.
            }
        },

        // TABLE CONFIGURATIONS OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create a createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;

// First, we imported the Model class and DataTypes object from Sequelize. This Model class is what we create 
    // our own models from using the extends keyword so User inherits all of the functionality the Model class has.
// Once we create the User class, we use the .init() method to initialize the model's data and configuration, 
    // passing in two objects as arguments. The first object will define the columns and data types for those columns. 
    // The second object it accepts configures certain options for the table. Learn more in the Sequelize documents for model configuration

// You can find all of the column settings in the Sequelize model definition documents (Links to an external site.) 
    // and all of the options for DataTypes in the Sequelize DataTypes documents

// If we didn't define the model to have a primaryKey option set up anywhere, Sequelize would create one for us, 
    // but it's best we explicitly define all of the data. 

// Sequelize's built-in validators are another great feature. We can use them to ensure any email data follows 
    // the pattern of an email address (i.e., <string>@<string>.<string>) so no one can give us incorrect data. 
    // There are a lot of prebuilt validators we can use from Sequelize, but you can also make your own, so it's 
    // worth reading through the documentation to see what's available to you.