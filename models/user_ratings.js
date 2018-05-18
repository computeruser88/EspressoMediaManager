module.exports = function(sequelize, DataTypes) {
    var User_rating = sequelize.define("User_rating", {
      // Giving the User_rating model a name of type STRING
      rating: DataTypes.INTEGER,
      review: DataTypes.STRING
    });
  
    User_rating.associate = function(models) {
      // Associating User_rating with Users and Media

      User_rating.belongsTo(models.User);

      User_rating.belongsTo(models.Media);
    };
  
    return User_rating;
  };
  