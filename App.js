import React from 'react';
import Chat from "./Chat";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Fire from "./Fire";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        _id: "",
        username: "",
      },
      hasUsername: false,
    };
  }

  componentDidMount() {
    const user = Fire.shared.user;
    const hasUsername = user.username != null;
    this.setState(() => ({
      user: {
        _id: user.uid,
        username: user.username,
      },
      hasUsername: hasUsername,
    }));
    console.log('uid = ' + Fire.shared.uid)
    console.log(this.state)
  }

  componentWillUnmount() {
    Fire.shared.off();
  }

  onChangeText = username => this.setState({
    user: {username: username}
  });

  onPress = () => {
    Fire.shared.setUser(this.state.user);
    this.setState({hasUsername: true});
  };

  render() {
    if (this.state.hasUsername) {
      return (
        <Chat user={this.state.user}/>
      )
    } else {
      return (
        <View>
          <Text style={styles.title}>Enter your name:</Text>
          <TextInput
            style={styles.nameInput}
            placeHolder="John Cena"
            onChangeText={this.onChangeText}
            value={this.state.username}
          />
          <TouchableOpacity onPress={this.onPress}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const offset = 24;
const styles = StyleSheet.create({
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
  },
});