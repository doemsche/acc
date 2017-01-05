import mongoose from 'mongoose';
const dbname = 'accntng';
mongoose.connect('mongodb://localhost/'+dbname);
const accountSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

const Account = mongoose.model('Account', accountSchema);

Account.insertMany([
  {name: 'lebensmittel'},
  {name: 'kasse'},
  {name: 'wohnung'},
  {name: 'versicherung'}]
);