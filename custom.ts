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
        // Chuyển sang bắt xung LOW vì mắt thu IR tích cực mức thấp
        pins.onPulsed(pin, PulseValue.Low, function () {
            let duration = pins.pulseDuration();

            // 1. Nhận diện tín hiệu START (NEC Protocol thường ~9ms Low)
            if (duration > 8000 && duration < 10000) {
                bitCount = 0;
                dataRaw = 0;
            }
            // 2. Nhận diện bit 1 (~1.6ms Low) và bit 0 (~0.5ms Low)
            // Nới lỏng khoảng thời gian để tăng độ nhạy
            else if (bitCount < 32) {
                if (duration > 1500 && duration < 1800) {
                    dataRaw |= (1 << bitCount);
                }
                bitCount++;

                // 3. Khi đủ 32 bit, tiến hành trích xuất mã lệnh
                if (bitCount === 32) {
                    // Logic chuẩn NEC: Mã lệnh nằm ở byte thứ 3
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