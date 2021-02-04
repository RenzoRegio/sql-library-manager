const Sequelize = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Please provide a value for title" } },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Please provide a value for author" } },
      },
      genre: { type: Sequelize.STRING },
      year: { type: Sequelize.INTEGER },
    },
    { sequelize }
  );
  sequelizePaginate.paginate(Book);
  return Book;
};
