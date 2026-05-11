/**
 * Thư viện Robot Lõi
 */
//% weight=100 color=#0fbc11 icon="\uf11b" block="Robot Lõi"
namespace RobotCore {
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
     * Khởi tạo mắt thu IR. 
     * Lưu ý: Mắt thu thường trả về mức thấp khi có tín hiệu.
     */
    //% block="Khởi tạo mắt thu IR tại chân %pin"
    export function initIR(pin: DigitalPin): void {
        pins.setPull(pin, PinPullMode.PullUp);
        // Chuyển sang bắt xung LOW
        pins.onPulsed(pin, PulseValue.Low, function () {
            let duration = pins.pulseDuration();

            // Nới rộng Start bit: NEC chuẩn là 9ms, nới từ 6ms đến 12ms
            if (duration > 6000 && duration < 12000) {
                bitCount = 0;
                dataRaw = 0;
            }
            else if (bitCount < 32) {
                // Bit 1 là xung ~1.6ms, nới thành 1ms đến 2.5ms
                if (duration > 1000 && duration < 2500) {
                    dataRaw |= (1 << bitCount);
                }
                bitCount++;

                if (bitCount === 32) {
                    // Trích xuất byte lệnh (Byte thứ 3 theo chuẩn NEC)
                    irCode = (dataRaw >> 16) & 0xFF;
                }
            }
        })
    }

    /**
     * Kiểm tra xem nút bấm có được nhấn không.
     * Trả về true 1 lần duy nhất mỗi khi nhận được tín hiệu mới.
     */
    //% block="Nút %btn được bấm?"
    export function isButtonPressed(btn: Button): boolean {
        if (irCode === btn) {
            irCode = -1; // Reset để không bị lặp lại trong vòng lặp
            return true;
        }
        return false;
    }
    
}