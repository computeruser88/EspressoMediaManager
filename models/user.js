module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      // Giving the User model a name of type STRING
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, primaryKey: true },
      password: DataTypes.STRING,
      type: { type: DataTypes.STRING, defaultValue: "user" },
      balance: {type: DataTypes.FLOAT, defaultValue: 0.0}
    });
  
    User.associate = function(models) {
      // Associating User with Posts
      // When an User is deleted, also delete any associated Posts
      User.hasMany(models.Transaction, {
        onDelete: "cascade"
      });

      User.hasMany(models.User_rating)
    };
  
    return User;
  };
  