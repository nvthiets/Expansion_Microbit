/**
 * Thư viện Robot Lõi
 */
//% weight=100 color=#0fbc11 icon="\uf11b" block="Robot Lõi"
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
}
