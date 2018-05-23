module.exports = function(sequelize, DataTypes) {
    var Media = sequelize.define("Media", {
      // Giving the Media model a name of type STRING
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      artist: { type: DataTypes.STRING, defaultValue: "Unknown"},
      genre: DataTypes.STRING,
      rating: DataTypes.STRING,
      year: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      time_limit: { type: DataTypes.INTEGER, defaultValue: 3 },
      cost: {type: DataTypes.FLOAT, defaultValue: 0.0}
    });
  
    Media.associate = function(models) {
      // Associating Media with Transaction
      Media.hasMany(models.Transaction);
    };
  
    return Media;
  };
  