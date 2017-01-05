import fs from 'fs';
import Express from 'express';
import fileUpload from 'express-fileupload';
import uuid from 'node-uuid';
import parse from 'csv-parse';

import mongoose from 'mongoose';
import es6Promise from 'es6-promise';

const dbname = 'accntng';
mongoose.connect('mongodb://localhost/'+dbname);
mongoose.Promise = es6Promise.Promise;
const bookingSchema = mongoose.Schema({
    date: String,
    text: String,
    in: String,
    out: String
});

const accountSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});
const Booking = mongoose.model('Booking', bookingSchema);
const Account = mongoose.model('Account', accountSchema);

// Config
const APP_PORT = 3000;

// Start
const app = Express();

app.set('view engine', 'pug');

app.use(Express.static('client'))

app.use(fileUpload());

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/files', (req, res)=>{
  fs.readdir('./uploads', (err, data)=>{
   res.render('files',{files:data});
  });
  
})

app.get('/upload', (req, res) => {
  res.render('upload')
});
app.get('/months', (req,res)=>{
  res.render('months');
});

app.get('/bookings/:month', (req,res)=>{
  let month = req.params.month;
  let q1 = Account.find();
  let q2 = Booking.find();
  let p1 = q1.exec();
  let p2 = q2.exec();

  Promise.all([p1,p2]).then(values=>{
    const accounts = values[0];
    const bookings = values[1];
    res.render('bookings',{
      accounts:accounts,
      bookings:bookings
    });
  });

});

app.get('/accounts', (req,res)=>{
  let accounts = Account.find({},(err,data)=>{
    res.render('accounts',{accounts: data});
  })
  
});

app.post('/upload', (req, res) => {

    let file;
    console.log(req.files)
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    file = req.files.file;
    file.mv('./uploads/'+uuid.v1()+'.csv', (err) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
});

app.post('/parse', (req, res)=>{

  let parser = parse({
    delimiter: ',',
    columns: true,
    trim: true,
    relax: false,
    relax_column_count: true
  },
    (err,data)=>{
      for(let i = 0; i < data.length; i++){
        //csv obj
        let tmp = data[i];
        console.log(tmp)
        //db obj
        let dbObj = new Booking({
          date:tmp.date,
          text:tmp.text,
          in:tmp.out,
          out:tmp.in,
        });
        console.log(dbObj)
        //save to db
        dbObj.save();
      }
    }
  );

  fs.createReadStream(__dirname+'/uploads/'+req.body.file+'.csv').pipe(parser);
  
});

app.post('/resetBookings', (req,res)=>{
  Booking.remove({}, ()=>{console.log('bks reset to nilll')});
});

app.listen(APP_PORT, ()=>{
  console.log('listening on PORT: '+APP_PORT)
})
