namespace RobotCore {

    /**
     * Khối lệnh test kiểm tra hệ thống
     */
    //% block="kiểm tra kết nối"
    export function systemCheck(): void {
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
        basic.clearScreen()
    }
}
