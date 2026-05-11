//% weight=100 color=#0fbc11 icon="\uf11b" block="Robot Lõi"
namespace RobotCore {
    /**
     * Quay Servo
     */
    //% block="Quay servo chân $pin góc $angle độ"
    //% angle.min=0 angle.max=180
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }
}
//% weight=90 color=#e74c3c icon="feed" block="RobotIR"
namespace RobotIR {
    let irCode = -1;
    let dataRaw = 0;
    let bitCount = 0;

    /**
     * Danh sách các nút bấm trên Remote 17 phím
     */
    export enum Button {
        //% block="Lên"
        Up = 0x62,
        //% block="Xuống"
        Down = 0xA8,
        //% block="Trái"
        Left = 0x22,
        //% block="Phải"
        Right = 0xC2,
        //% block="OK"
        OK = 0x02,
        //% block="1"
        Num1 = 0x68,
        //% block="2"
        Num2 = 0x98,
        //% block="3"
        Num3 = 0xB0,
        //% block="4"
        Num4 = 0x30,
        //% block="5"
        Num5 = 0x18,
        //% block="6"
        Num6 = 0x7A,
        //% block="7"
        Num10 = 0x10,
        //% block="8"
        Num8 = 0x38,
        //% block="9"
        Num9 = 0x5A,
        //% block="0"
        Num0 = 0x4A,
        //% block="*"
        Star = 0x42,
        //% block="#"
        Hash = 0x52
    }

    /**
     * Khởi tạo mắt thu IR tại chân P16
     */
    //% block="Khởi tạo mắt thu IR tại chân %pin"
    export function initIR(pin: DigitalPin): void {
        pins.setPull(pin, PinPullMode.PullUp);
        pins.onPulsed(pin, PulseValue.High, function () {
            let duration = pins.pulseDuration();
            if (duration > 4000 && duration < 5000) {
                bitCount = 0; dataRaw = 0;
            } else if (duration > 1500 && duration < 2500) {
                dataRaw += (1 << bitCount); bitCount++;
            } else if (duration > 300 && duration < 800) {
                bitCount++;
            }
            if (bitCount === 32) {
                irCode = (dataRaw >> 16) & 0xFF;
                bitCount = 0;
            }
        })
    }

    /**
     * Kiểm tra nút bấm
     */
    //% block="Nút %btn được bấm?"
    export function isButtonPressed(btn: Button): boolean {
        if (irCode === btn) {
            irCode = -1;
            return true;
        }
        return false;
    }
}