/**
 * Thư viện Robot Lõi
 */
//% weight=100 color=#0fbc11 icon="\uf11b" block="Robot Lõi"
namespace RobotCore {
    /**
     * Quay Servo
     * @param pin Chân cắm servo, eg: AnalogPin.P1
     * @param angle Góc quay 0-180, eg: 90
     */
    //% block="Quay servo chân %pin góc %angle độ"
    //% angle.min=0 angle.max=180
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }
}

/**
 * Thư viện Robot IR
 */
//% weight=90 color=#e74c3c icon="\uf012" block="RobotIR"
namespace RobotIR {
    let irCode = -1;
    let dataRaw = 0;
    let bitCount = 0;

    export enum Button {
        //% block="Lên"
        Up = 0x62,
        //% block="Xuống"
        Down = 0xA8,
        //% block="Trái"
        Left = 0x22,
        //% block="Phải"
        Right = 0xC2,
        //% block="OK"
        OK = 0x02
    }

    /**
     * Khởi tạo mắt thu IR
     */
    //% block="Khởi tạo mắt thu IR tại chân %pin"
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
     * Kiểm tra nút bấm
     */
    //% block="Nút %btn được bấm?"
    export function isButtonPressed(btn: Button): boolean {
        if (irCode === btn) {
            irCode = -1;
            return true;
        }
        return false;
    }
}