/**
 * Thư viện Expansion Microbit - Tối ưu cho Robot Kit
 */
//% weight=100 color=#0fbc11 icon="\uf11b" block="Expansion Microbit"
namespace Expansion_Microbit {
    let irCode = -1;
    let dataRaw = 0;
    let bitCount = 0;

    export enum Button {
        //% block="1"
        B1 = 0xA2,
        //% block="2"
        B2 = 0x62,
        //% block="3"
        B3 = 0xE2,
        //% block="4"
        B4 = 0x22,
        //% block="5"
        B5 = 0x02,
        //% block="6"
        B6 = 0xC2,
        //% block="7"
        B7 = 0xE0,
        //% block="8"
        B8 = 0xA8,
        //% block="9"
        B9 = 0x90,
        //% block="*"
        Star = 0x68,
        //% block="0"
        B0 = 0x98,
        //% block="#"
        Hash = 0xB0,
        //% block="Lên"
        Up = 0x18,
        //% block="Xuống"
        Down = 0x4A,
        //% block="Trái"
        Left = 0x10,
        //% block="Phải"
        Right = 0x5A,
        //% block="OK"
        OK = 0x38
    }

    /**
     * Quay Servo
     */
    //% block="Quay servo chân %pin góc %angle độ"
    //% angle.min=0 angle.max=180
    //% group="Cơ cấu chấp hành"
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }

    /**
     * Bật/Tắt thiết bị (LED, Còi...)
     */
    //% block="điều khiển chân %pin trạng thái %status"
    //% group="Cơ cấu chấp hành"
    export function deviceControl(pin: DigitalPin, status: boolean): void {
        pins.digitalWritePin(pin, status ? 1 : 0);
    }

    /**
     * Khởi tạo mắt thu IR (Dùng chân P16 theo mạch)
     */
    //% block="Khởi tạo mắt thu IR tại chân %pin"
    //% group="Cảm biến IR"
    export function initIR(pin: DigitalPin): void {
        pins.setPull(pin, PinPullMode.PullUp);
        pins.onPulsed(pin, PulseValue.Low, function () {
            let duration = pins.pulseDuration();
            if (duration > 8000 && duration < 10000) {
                bitCount = 0; dataRaw = 0;
            } else if (bitCount < 32) {
                if (duration > 1500 && duration < 1800) {
                    dataRaw |= (1 << bitCount);
                }
                bitCount++;
                if (bitCount === 32) {
                    irCode = (dataRaw >> 16) & 0xFF;
                }
            }
        })
    }

    /**
     * Kiểm tra nút bấm IR
     */
    //% block="Nút %btn được bấm?"
    //% group="Cảm biến IR"
    export function isButtonPressed(btn: Button): boolean {
        if (irCode === btn) {
            irCode = -1;
            return true;
        }
        return false;
    }

    /**
     * Đo khoảng cách siêu âm (Trig P13, Echo P14 theo mạch)
     */
    //% block="Khoảng cách siêu âm (cm) Trig %trig Echo %echo"
    //% group="Cảm biến Siêu âm"
    export function readUltrasonic(trig: DigitalPin, echo: DigitalPin): number {
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);
        let d = pins.pulseIn(echo, PulseValue.High, 25000);
        let distance = Math.floor(d * 0.017);
        return (distance <= 0 || distance > 400) ? 400 : distance;
    }
}