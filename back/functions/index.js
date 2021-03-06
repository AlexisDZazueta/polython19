const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('./config');

admin.initializeApp({
  credential: admin.credential.cert(config.admin),
  databaseURL: config.databaseURL
});

firebase.initializeApp(config.firebase);

exports.signUp = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  const email = req.body.email;
  const pass = req.body.pass;
  admin.auth().createUser({
    email: email,
    emailVerified: true,
    password: pass
  })
  .then(userRecord => {
    return admin.database().ref('/usersDetail').push({
      uid: userRecord.uid,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      countryCode: req.body.countryCode,
      phoneNumber: req.body.phoneNumber,
      accountType: req.body.accountType,
      taxpayerNum: req.body.taxpayerNum
    })
      .then(snapshot => {
        return res.send({ message: snapshot });
      })
      .catch(error => {
        return res.send({ message: error });
      });
  })
  .catch(error => {
    return res.send({ error: `Error creating the new user: ${error}` });
  })
  return 1;
});

exports.signIn = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.pass)
    .then(userRecord => {
      return res.send({ message: userRecord });
    })
    .catch(error => {
      return res.send({ message: error });
    });
  return 1;
});

exports.signOut = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  firebase.auth().signOut()
    .then(userRecord => {
      return res.send({ message: userRecord });
    })
    .catch(error => {
      return res.send({ message: error });
    });
  return 1;
});

exports.addBusinessAccount = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  return admin.database().ref('/businessAccounts').push({
    accountNum: req.body.accountNum,
    businessName: req.body.businessName,
    taxResidence: req.body.taxResidence,
    bank: req.body.bank,
    zipCode: req.body.zipCode,
    uid: req.body.uid
  })
    .then(snapshot => {
      return res.send({ message: snapshot });
    })
    .catch(error => {
      return res.send({ message: error });
    });
});

exports.addProductToStock = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  return admin.database().ref('/stock').push({
    uid: req.body.uid,
    productName: req.body.productName,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description
  })
    .then(snapshot => {
      return res.send({ message: snapshot });
    })
    .catch(error => {
      return res.send({ message: error });
    })
});

exports.addCard = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  return admin.database().ref('/cards').push({
    uid: req.body.uid,
    cardName: req.body.cardName,
    cardNum: req.body.cardNum,
    cardType: req.body.cardType,
    expirationDate: req.body.expirationDate,
    cardCvv: req.body.cardCvv
  })
    .then(snapshot => {
      return res.send({ message: snapshot });
    })
    .catch(error => {
      return res.send({ message: error });
    })
});

exports.transaction = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method !== "POST") {
    return res.status(500).send("What are you trying baby?");
  }
  firebase.database().ref(`cards/${req.body.cardId}`).once('value')
    .then(snapshot => {
      return admin.database().ref('/transactions').push({
        from: snapshot.uid,
        to: req.body.uid,
        total: req.body.total
      })
        .then(snap => {
          return res.send({ message: snap });
        })
        .catch(error => {
          return res.send({ message: error });
        })
    })
    .catch(error => {
      return res.send({ message: error });
    });
  return 1;
});
