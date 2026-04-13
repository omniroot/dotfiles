import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Widgets

Rectangle {
    id: root

    // injected
    property var pluginApi: null
    property ShellScreen screen
    property string widgetId: ""
    property string section: ""

    property string trackText: "No music"

    implicitHeight: Style.barHeight
    implicitWidth: row.implicitWidth + Style.marginM * 2

    color: Style.capsuleColor
    radius: Style.radiusM

    // ---- PROCESS ----
    Process {
        id: mpcProc

        stdout: StdioCollector {
            id: outCollector
            onStreamFinished: {
                const txt = (outCollector.text || "").trim()
                trackText = txt.length ? txt : "Stopped"
            }
        }

        stderr: StdioCollector {
            onStreamFinished: {
                const err = (text || "").trim()
                if (err.length)
                    Logger.w("mpd-widget", err)
            }
        }

        // ✅ вот правильный сигнал вместо onFinished
        onExited: {
            // можно логировать при желании
            // Logger.d("mpd-widget", "mpc exited", exitCode)
        }
    }

    // ---- RUN COMMAND ----
    function runMpc(args) {
        mpcProc.exec(args)
    }

    // ---- AUTO REFRESH ----
    Timer {
        interval: 2000
        running: true
        repeat: true
        onTriggered: runMpc(["mpc", "current"])
    }

    RowLayout {
        id: row
        anchors.centerIn: parent
        spacing: Style.marginS

        // ⏮️
        NIcon {
            icon: "player-track-prev"
            color: Color.mOnSurface
            MouseArea {
                anchors.fill: parent
                onClicked: runMpc(["mpc", "prev"])
                cursorShape: Qt.PointingHandCursor
            }
        }

        // ⏯️
        NIcon {
            icon: "player-play"
            color: Color.mOnSurface
            MouseArea {
                anchors.fill: parent
                onClicked: runMpc(["mpc", "toggle"])
                cursorShape: Qt.PointingHandCursor
            }
        }

        // ⏭️
        NIcon {
            icon: "player-track-next"
            color: Color.mOnSurface
            MouseArea {
                anchors.fill: parent
                onClicked: runMpc(["mpc", "next"])
                cursorShape: Qt.PointingHandCursor
            }
        }

        // 🎵 title
        NText {
            text: trackText
            color: Color.mOnSurface
            pointSize: Style.fontSizeS
            elide: Text.ElideRight
            Layout.maximumWidth: 250
        }
    }

    Component.onCompleted: runMpc(["mpc", "current"])
}