module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define("Transaction", {
      // Giving the Transaction model a name of type STRING
      checked_out_date : DataTypes.DATE,
      returned_date: DataTypes.DATE
    });
  
    Transaction.associate = function(models) {
      // Associating Transaction with Users and Media

      Transaction.belongsTo(models.User);
      Transaction.belongsTo(models.Media);
    };
  
    return Transaction;
  };
  