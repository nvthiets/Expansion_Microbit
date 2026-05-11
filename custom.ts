//% weight=100 color=#0fbc11 icon="\uf11b" block="Expansion_Microbit"
namespace Expansion_Microbit {
    /**
     * Quay servo 
     * @param pin chân cắm servo, eg: AnalogPin.P1
     * @param angle góc quay từ 0 đến 180, eg: 90
     */
    //% block="Quay servo chân %pin góc %angle độ"
    //% angle.min=0 angle.max=180
    //% group="Cơ cấu chấp hành"
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }

    /**
     * Đọc khoảng cách từ cảm biến siêu âm HC-SR04 (cm)
     * @param trig chân phát (Trig), eg: DigitalPin.P13
     * @param echo chân thu (Echo), eg: DigitalPin.P14
     */
    //% block="siêu âm chân TRIG %trig ECHO %echo đơn vị cm"
    //% weight=94
    //% group="Cảm biến"
    export function readUltrasonic(trig: DigitalPin, echo: DigitalPin): number {
        // Đảm bảo chân Trig ở mức thấp trước khi phát xung
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);

        // Phát xung 10us
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // Đọc xung phản hồi. Timeout 30000us (~500cm) là đủ dùng.
        let data = pins.pulseIn(echo, PulseValue.High, 30000);

        // Cơ chế Retry nếu lần 1 lỗi
        if (data == 0) {
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            data = pins.pulseIn(echo, PulseValue.High, 30000);
        }

        // Tính toán khoảng cách (cm)
        let distance = data / 58;

        // Xử lý giá trị biên
        if (distance <= 0 || distance > 400) {
            return 400; // Trả về 400cm nếu không có vật cản (ngoài tầm)
        }

        return Math.round(distance);
    }
}