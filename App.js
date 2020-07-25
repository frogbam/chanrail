import React from "react";
import { Platform, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Input, Card, ListItem, Button, Icon } from "react-native-elements";

import {
  AppState,
  ScrollView,
  TimePickerAndroid,
  DatePickerAndroid,
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Alert
} from "react-native";
import { white } from "ansi-colors";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import Modal from "react-native-modal";
import BackgroundTimer from "react-native-background-timer";
import LottieView from "lottie-react-native";
import PushNotification from "react-native-push-notification";
const korail = require("korailjs").default;

const BG = [
  require("./img/bg2.jpg"),
  require("./img/bg3.jpg"),
  require("./img/bg4.jpg"),
  require("./img/bg5.jpg")
];

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      result: "??",
      spinner: false,
      bg: BG[Math.floor(Math.random() * BG.length)]
    };
  }
  // static navigationOptions = {
  //   header: null
  // }

  // componentDidMount(){
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     Alert.alert(
  //       '종료',
  //       '챈레일을 종료합니다.',
  //       [
  //         {text: 'No', onPress: () => {}},
  //         {text: 'Yes', onPress: () => BackHandler.exitApp()},
  //       ],
  //     );
  //     return true;
  //   })
  // }
  // componentWillUnmount() {
  //   this.backHandler.remove();
  // }

  _loginCheck() {
    this.setState({
      spinner: !this.state.spinner
    });

    korail.login(this.state.id, this.state.password).then(logincheck => {
      this.setState({
        result: logincheck.toString()
      });

      if (logincheck) {
        this.props.navigation.navigate("SearchTrain", {
          id: this.state.id,
          password: this.state.password
        });
        this.setState({
          spinner: !this.state.spinner
        });
      } else {
        this.setState({
          spinner: !this.state.spinner
        });
        return;
      }
    });
  }

  render() {
    return (
      <View>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          animation="fade"
          textStyle={{ color: "#FFF" }}
          cancelable={true}
        />
        <ImageBackground
          source={this.state.bg}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ margin: 10, paddingBottom: 40 }}>
            <Text style={styles.LoginScreenTitle}>"인간시대의</Text>
            <Text style={styles.LoginScreenTitle}>끝이 도래했다."</Text>
            <Text style={styles.LoginScreenTitleBtz}>-챈레일</Text>
          </View>
          <View>
            {/* <Card
            containerStyle={styles.LoginScreenCardContainer}
            > */}
            <View style={{ paddingTop: 10, paddingBottom: 60 }}>
              {/* <View style={{paddingTop:5, paddingBottom:5, margin:10, borderWidth: 2, borderColor:"white"}}> */}
              <View
                style={{
                  margin: 10,
                  borderWidth: 2,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderColor: "white"
                }}
              >
                <Input
                  leftIcon={<Icon name="person" />}
                  placeholderTextColor="black"
                  placeholder="이메일 or 코레일 멤버쉽 번호"
                  onChangeText={text =>
                    this.setState({
                      id: text
                    })
                  }
                />
              </View>
              {/* <View style={{paddingTop:5, paddingBottom:5, margin:10, borderWidth: 2, borderColor:"white"}}> */}
              <View
                style={{
                  margin: 10,
                  borderWidth: 2,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderColor: "white"
                }}
              >
                <Input
                  leftIcon={<Icon name="lock" />}
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  placeholder="비밀번호"
                  onChangeText={text =>
                    this.setState({
                      password: text
                    })
                  }
                />
              </View>
            </View>

            <Button
              containerStyle={{ paddingRight: "20%", paddingLeft: "20%" }}
              onPress={this._loginCheck.bind(this)}
              title="로그인"
            />
            {/* <Text>{this.state.result}</Text>
              <Text>{this.state.id}</Text>
              <Text>{this.state.password}</Text> */}

            {/* </Card> */}
          </View>
          <View style={{ margin: 10 }}>
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "center",
                fontSize: 15,
                color: "white"
              }}
            >
              by ChanChanho
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

class SearchTrainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.__askOK = this._askOK.bind(this);
    this.state = {
      dep: "용산",
      arr: "전주",
      date: moment().format("YYYYMMDD"),
      time: moment().format("HHmmss"),
      trains: ["검색을 눌러주세요"],
      spinner: false,
      id: "",
      password: ""
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      id: navigation.getParam("id", "아이디 정보를 가져오지 못했습니다."),
      password: navigation.getParam(
        "password",
        "비밀번호 정보를 가져오지 못했습니다."
      )
    });

    try {
      const { action, year, month, day } = await DatePickerAndroid.open({});
      if (action !== DatePickerAndroid.dismissedAction) {
        let date = new Date(year, month, day);
        date = moment(date).format("YYYYMMDD");
        this.setState({ date: date });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }

    try {
      const { action, hour, minute } = await TimePickerAndroid.open({});
      if (action !== TimePickerAndroid.dismissedAction) {
        // let time = monet(hour,minute,'h','m').format('hh:mm');
        // // time = moment(time).format("hh:mm")
        // this.setState({time:"asdfasdf"})
        let m = minute < 10 ? "0" + minute : minute;
        let h = hour < 10 ? "0" + hour : hour;
        this.setState({ time: h.toString() + m.toString() + "00" });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  }

  _searchTrain() {
    this.setState({
      spinner: true
    });

    if (this.state.arr === null || this.state.dep === null) {
      this.setState({
        trains: ["역 정보를 확인해주세요!"]
      });
      this.setState({
        spinner: false
      });
      return;
    }
    korail
      .searchTrain(
        this.state.dep.toString(),
        this.state.arr.toString(),
        this.state.date.toString(),
        this.state.time.toString()
      )
      .then(train => {
        if (train[0] == null) {
          this.setState({
            trains: ["기차가 없습니다. 기차역이나 날짜, 시간을 확인해주세요"]
          });
          this.setState({
            spinner: false
          });
          return;
        }
        for (let i in train) {
          if (train[i]["trainTypeName"].indexOf("KTX") !== -1) {
            train[i]["color"] = "#cccc33";
          } else if (train[i]["trainTypeName"].includes("ITX")) {
            train[i]["color"] = "#b5b5bd";
          } else if (train[i]["trainTypeName"].includes("무궁화")) {
            train[i]["color"] = "#9c5221";
          } else {
            train[i]["color"] = "";
          }
        }

        this.setState({
          trains: train
        });
        this.setState({
          spinner: false
        });
      })
      .catch(error => {
        this.setState({
          trains: [error.msg.toString()]
        });
        this.setState({
          spinner: false
        });
      });
  }

  _goToWorkScreen() {
    this.props.navigation.navigate("Worker");
  }

  _askOK(index) {
    Alert.alert(
      "알림",
      this.state.trains[index].toString() + "\n위 열차로 진행합니까?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            this.props.navigation.navigate("Work", {
              trains: this.state.trains.slice(),
              selectedIndex: index,
              id: this.state.id,
              password: this.state.password
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  // trainList(){
  //   let trainList = []
  //   for(i in this.state.trains){
  //     trainList.push(<ListItem title:{this.state.trains[i]}/>)
  //   }
  //   return trainList;
  // }

  render() {
    return (
      <View>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          animation="fade"
          textStyle={{ color: "#FFF" }}
          cancelable={true}
        />
        <ImageBackground
          source={require("./img/bg4.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <ScrollView style={{ flex: 1 }}>
            <Card style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <DatePicker
                  style={{ width: 200, flex: 1 }}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  // maxDate="2016-06-01"
                  confirmBtnText="확인"
                  cancelBtnText="취소"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={date => {
                    date = moment(date).format("YYYYMMDD");
                    this.setState({ date: date });
                  }}
                />

                <DatePicker
                  style={{ width: 200, flex: 1 }}
                  date={this.state.time}
                  mode="time"
                  placeholder="select time"
                  format="HH:mm"
                  // maxDate="2016-06-01"
                  confirmBtnText="확인"
                  cancelBtnText="취소"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={time => {
                    //time = moment(time).format("hh:mm");
                    time = moment(time, "HHmmss").format("HHmmss");
                    this.setState({ time: time });
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 6 }}>
                  <Input
                    textAlign={"center"}
                    placeholder="출발 역"
                    onChangeText={text =>
                      this.setState({
                        dep: text
                      })
                    }
                  />
                  {/* <Picker
              selectedValue={this.state.dep}
              
              onValueChange={(itemValue, itemIndex) =>
                this.setState({dep:itemValue})
              }>
              {
                STATIONS.map((element, index, array) => (
                  <Picker.Item label={STATIONS[index].name.toString()} value={STATIONS[index].name.toString()}/>
                ))}
              
            </Picker> */}
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Icon name="arrow-forward" />
                </View>

                <View style={{ flex: 6 }}>
                  <Input
                    textAlign={"center"}
                    placeholder="도착 역"
                    onChangeText={text =>
                      this.setState({
                        arr: text
                      })
                    }
                  />
                  {/* <Picker
              selectedValue={this.state.arr}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({arr: itemValue})
              }>
              {
                STATIONS.map((element, index, array) => (
                  <Picker.Item label={STATIONS[index].name.toString()} value={STATIONS[index].name.toString()}/>
                ))}
            </Picker> */}
                </View>
              </View>
              <View style={{ paddingTop: 10 }}>
                <Button onPress={this._searchTrain.bind(this)} title="검색" />
              </View>
            </Card>

            <Card style={{ flex: 1 }}>
              {/* <Text>{this.state.trains.toString()}</Text> */}
              {this.state.trains.map((element, index, array) => (
                <ListItem
                  containerStyle={
                    index % 2 == 1
                      ? { backgroundColor: "rgba(128,128,128,0.2)" }
                      : null
                  }
                  key={index}
                  title={element.toString()}
                  // leftIcon={{name:"train"}}
                  leftIcon={<Icon name="train" color={element.color} />}
                  onPress={event => {
                    array[0] == "검색을 눌러주세요"
                      ? null
                      : this.__askOK(index);
                  }}
                  component={Button}
                />
              ))}
            </Card>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

class WorkScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trains: ["1"],
      selectedIndex: null,
      status: "",
      id: "",
      password: "",
      endless: null,
      modal: true,
      lottieSrc: require("./src/trying.json"),
      workFlag: false
    };
  }

  // componentWillUnmount() {
  //   BackgroundTimer.clearInterval(this.state.endless);
  //   PushNotification.clearLocalNotification(parseInt(id, 123));

  // }

  _endlessReserve() {
    this.setState({
      modal: true
    });
    if (this.state.workFlag == true) {
      return;
    }

    if (this.state.selectedIndex == null) {
      //모달로 처리
      this.setState({
        status: "기차정보를 가져오지 못했습니다."
      });
      return;
    }

    this.setState({
      workFlag: true
    });
    this.setState({
      lottieSrc: require("./src/nyan-cat.json")
    });
    this.animation.play();

    let endless = BackgroundTimer.setInterval(() => {
      this.setState({
        endless: endless
      });

      korail
        .reserve(this.state.trains[this.state.selectedIndex])
        .then(result => {
          this.setState({
            status:
              result.toString() + "\n" + moment().format("MM월 DD일 hh:mm:ss")
          });

          BackgroundTimer.clearInterval(this.state.endless);

          //성공하고 인터벌 종료후.
          // this.setState({
          //   modal:false
          // })
          this.pushSuccNotifi();
          this.setState({
            lottieSrc: require("./src/success.json")
          });
          this.animation.play();
        })
        .catch(error => {
          this.setState({
            status:
              error.msg.toString() +
              "\n" +
              moment().format("MM월 DD일 hh:mm:ss")
          });

          if (error.msg.toString() == "Need to Login") {
            korail
              .login(this.state.id, this.state.password)
              .then(logincheck => {
                if (logincheck) {
                  this.setState({
                    status: "재 로그인 성공"
                  });
                } else {
                  this.setState({
                    status: "로그인을 시도했으나 로그인 실패"
                  });
                }
              })
              .catch(error => {
                this.setState({
                  status:
                    error.msg.toString() +
                    "\n" +
                    moment().format("MM월 DD일 hh:mm:ss")
                });
              });
          }
        });
    }, 2000);
  }

  // _stopReserve(){
  //   BackgroundTimer.clearInterval(this.state.endless);
  //   this.setState({
  //     status:"Stop"
  //   })
  // }

  _stopModal() {
    Alert.alert(
      "알림",
      "예약시도를 멈추시겠습니까?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            BackgroundTimer.clearInterval(this.state.endless);
            this.animation.reset();
            // BackgroundTimer.stopBackgroundTimer();
            this.setState({
              status: "",
              workFlag: false
              // modal:false
            });
          }
        }
      ],
      { cancelable: false }
    );

    // BackgroundTimer.clearInterval(this.state.endless);
    // // BackgroundTimer.stopBackgroundTimer();
    // this.setState({
    //   status:"Stop",
    //   modal:false
    // })
  }

  // pushOngoingNotifi() {
  //   PushNotification.localNotification({
  //     id: "1",
  //     userInfo: { id: "123" },
  //     message: "열심히 기차를 잡는 중....", // message
  //     ongoing: true,
  //     color: "red",
  //     autoCancel: false
  //   });
  // }

  pushSuccNotifi() {
    PushNotification.localNotification({
      id: "7",
      // message: this.state.trains[this.state.selectedIndex].toString()+"예약성공! 챈레일이 해냈읍니다...!", // message
      message: "예약성공! 챈레일이 해냈습니다...!", // message
      ongoing: false,
      autoCancel: true
    });
  }

  cancelNotifi() {
    PushNotification.cancelAllLocalNotifications();
  }

  askBack() {
    Alert.alert(
      "알림",
      "기차선택 화면으로 돌아가시겠습니까?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            BackgroundTimer.clearInterval(this.state.endless);
            PushNotification.cancelAllLocalNotifications();
            this.setState({
              status: "stop",
              modal: false,
              workFlag: false
            });
            this.props.navigation.navigate("SearchTrain");
          }
        }
      ],
      { cancelable: false }
    );
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      trains: navigation.getParam("trains", "기차 정보를 가져오지 못했습니다."),
      selectedIndex: parseInt(
        navigation.getParam(
          "selectedIndex",
          "선택한 기차 정보를 가져오지 못했습니다."
        )
      ),
      id: navigation.getParam("id", "id 정보를 가져오지 못했습니다."),
      password: navigation.getParam(
        "password",
        "password 정보를 가져오지 못했습니다."
      )
    });
    // this.pushOngoingNotifi();
    setTimeout(() => {
      this._endlessReserve();
    }, 200);
  }

  componentWillUnmount() {
    BackgroundTimer.clearInterval(this.state.endless);
    PushNotification.cancelAllLocalNotifications();
  }

  render() {
    return (
      <View>
        <ImageBackground
          source={require("./img/bg4.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ flex: 1 }}>
            <Modal
              isVisible={this.state.modal}
              onBackButtonPress={this.askBack.bind(this)}
            >
              <View>
                <Card>
                  <View>
                    <View style={{ height: 200 }}>
                      <LottieView
                        ref={animation => {
                          this.animation = animation;
                        }}
                        loop={true}
                        source={this.state.lottieSrc}
                      />
                    </View>
                    <Text style={{ height: 100, fontSize: 15 }}>
                      {this.state.status}
                    </Text>
                    {/* <View style={{margin:15}}>
                    <View>
                      <Button title="시작" onPress={this._endlessReserve.bind(this)}/>
                    </View>
                    <View style={{marginTop:10}}>
                      <Button title="멈추기" onPress={this._stopModal.bind(this)}/>
                    </View>
                  </View> */}
                  </View>
                </Card>
              </View>
            </Modal>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {/* <Text style={{color:'white'}}>{this.state.status}</Text>
            <Button title="예매 시작" onPress={this._endlessReserve.bind(this)}/> */}
              {/* <Button title="stop" onPress={this._stopReserve.bind(this)}/> */}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  LoginScreenTitle: {
    textAlign: "left",
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center"
  },
  LoginScreenTitleBtz: {
    textAlign: "left",
    color: "white",
    fontSize: 20,
    alignItems: "center"
  },
  LoginScreenCardContainer: {
    backgroundColor: "rgba(255,255,255,0.7)"
  },

  LoginScreenInput: {}
});

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    SearchTrain: SearchTrainScreen,
    Work: WorkScreen
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
