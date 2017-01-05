import Sequelize from 'sequelize';
import _ from 'underscore';
import Faker from 'faker';

const Conn = new Sequelize(
  'ebooks',
  'dschlaepfer',
  '',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

const tagNames = ['js', 'ruby', 'c#', 'go', 'php'];

const Book = Conn.define('book', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  publisher: {
    type: Sequelize.STRING
  },
  year: {
    type: Sequelize.STRING
  }
});

const BookShelf = Conn.define('bookshelf', {
  title: {
    type: Sequelize.STRING
  }
});

const Tag = Conn.define('tag',{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  color: {
    type: Sequelize.STRING
  }
});

const BookTags = Conn.define('booktags', {});

Tag.belongsToMany(Book, {through: BookTags});

BookShelf.hasMany(Book);
Book.belongsTo(BookShelf);

Conn.sync({force: true}).then(()=>{

  for(let i = 0; i < tagNames.length; i++){
    Tag.create({
      name: tagNames[i],
      color: 'red'
    });
  }

  _.times(20, ()=>{
    return 
  });
});