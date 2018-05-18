module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define("Transaction", {
      // Giving the Transaction model a name of type STRING
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      type: { type: DataTypes.STRING, defaultValue: "Transaction" }
    });
  
    Transaction.associate = function(models) {
      // Associating Transaction with Users and Media

      Transaction.belongsTo(models.User, {
  
      });

      Transaction.belongsTo(models.Media, {
        
      });
    };
  
    return Transaction;
  };
  