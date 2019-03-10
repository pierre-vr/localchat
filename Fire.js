import firebase from 'firebase';

require("firebase/firestore");

export default class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () =>
    firebase.initializeApp({
      apiKey: "AIzaSyB3O8-8TO-IDnHvQlZMvOinMZFLSW3KaME",
      authDomain: "localchat-b4485.firebaseapp.com",
      databaseURL: "https://localchat-b4485.firebaseio.com",
      projectId: "localchat-b4485",
      storageBucket: "localchat-b4485.appspot.com",
      messagingSenderId: "454004138924"
    });

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    console.log("loggin in");
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({message}) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.firestore();
  }

  parse = snapshot => {
    const {timestamp, text, user_id} = snapshot.data();
    return {
      _id: snapshot.id,
      createdAt: timestamp.toDate(),
      text,
      user: {
        _id: user_id
      },
    };
  };

  get user() {
    let user = firebase.auth().currentUser || {};
    user.username = null;
    this.ref.collection("users").doc("i").get().then(function (doc) {
      if (doc.exists) {
        user.username = doc.data().username
      }
    }).catch(function (error) {
      console.log("Error getting user:", error);
    });
    return user;
  }

  setUser(user) {
    this.ref.collection("users").doc("yol").set({username: user.username})
      .catch(function (error) {
        console.error("Error saving message in db: ", error);
      });
  }

  on = callback => {
    const parse = this.parse;
    this.ref.collection("messages").get().then(function (querySnapshot) {
      querySnapshot.forEach(doc => {
        console.log(doc.data());
        callback(parse(doc));
      })
    });
  };

  get timestamp() {
    return firebase.firestore.Timestamp.now();
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text} = messages[i];
      const message = {
        text,
        user_id: firebase.auth().currentUser.uid,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => {
    this.ref().collection("messages").add(message)
      .catch(function (error) {
        console.error("Error saving message in db: ", error);
      });
  };

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();