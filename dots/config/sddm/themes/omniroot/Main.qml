import QtQuick 2.0

Rectangle {
    width: 1920
    height: 1080
    color: "#222"

    Text {
        text: "Login"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 200
        color: "white"
        font.pixelSize: 40
    }

    TextField {
        id: username
        placeholderText: "Username"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 300
    }

    TextField {
        id: password
        placeholderText: "Password"
        echoMode: TextInput.Password
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: username.bottom
        anchors.topMargin: 20
    }

    Button {
        text: "Login"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: password.bottom
        anchors.topMargin: 30

        onClicked: sddm.login(username.text, password.text)
    }
}
