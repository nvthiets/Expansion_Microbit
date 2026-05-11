/**
 * Thư viện Robot Lõi
 */
//% weight=100 color=#0fbc11 icon="\uf11b" block="Expansion_Microbit"
namespace Expansion_Microbit {
    /**
     * Điều khiển góc quay của động cơ Servo
     * @param pin Chân cắm servo, eg: AnalogPin.P1
     * @param angle Góc quay 0-180, eg: 90
     */
    //% block="Quay servo chân %pin góc %angle độ"
    //% angle.min=0 angle.max=180
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }
    /**
     * Đọc dữ liệu từ cảm biến siêu âm (đơn vị: cm)
     * @param trig chân kích hoạt, eg: DigitalPin.P13
     * @param echo chân nhận phản hồi, eg: DigitalPin.P14
     */
    //% block="siêu âm chân TRIG %trig ECHO %echo đơn vị cm"
    //% weight=94
    export function readUltrasonic(trig: DigitalPin, echo: DigitalPin): number {
        let data: number;

        // Lần đọc thứ 1
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);
        // Timeout 1000 * 58 us tương đương khoảng 1 mét để tốc độ phản hồi nhanh hơn
        data = pins.pulseIn(echo, PulseValue.High, 58000);

        // Cơ chế Retry: Nếu lần 1 không nhận được (data == 0), thử lại lần 2
        if (data == 0) {
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            data = pins.pulseIn(echo, PulseValue.High, 58000);
        }

        /**
         * Tính toán khoảng cách:
         * Hệ số 58 (hoặc 59.259) là hằng số vật lý dựa trên vận tốc âm thanh.
         * Quãng đường (cm) = Thời gian (us) / 58
         */
        let distance = data / 58;

        // Giới hạn giá trị trả về
        if (distance <= 0) return 0;
        if (distance > 300) return 300; // Giới hạn tối đa 300cm theo code mẫu

        return Math.round(distance);
    }
}