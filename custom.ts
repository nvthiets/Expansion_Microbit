//% weight=100 color=#0fbc11 icon="\uf11b" block="Expansion_Microbit"
namespace Expansion_Microbit {

    export enum ServoChannel {
        //% block="Servo 1 (Chân IC 15)"
        CH8 = 8,
        //% block="Servo 2 (Chân IC 16)"
        CH9 = 9,
        //% block="Servo 3 (Chân IC 17)"
        CH10 = 10,
        //% block="Servo 4 (Chân IC 18)"
        CH11 = 11,
        //% block="Servo 5 (Chân IC 19)"
        CH12 = 12,
        //% block="Servo 6 (Chân IC 20)"
        CH13 = 13,
        //% block="Servo 7 (Chân IC 21)"
        CH14 = 14,
        //% block="Servo 8 (Chân IC 22)"
        CH15 = 15
    }

    const PCA9685_ADDRESS = 0x40;
    const MODE1 = 0x00;
    const PRESCALE = 0xFE;
    const LED0_ON_L = 0x06;

    let initialized = false;

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00);

        let freq = 50;
        let prescaleval = 25000000 / 4096 / freq - 1;

        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10;
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode);
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescaleval);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);

        setPwm(0, 0, 4095);
        for (let idx = 1; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        initialized = true;
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15) return;
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    //% block="Servo PCA9685 |%channel| quay %degree độ"
    //% weight=99
    //% degree.min=0 degree.max=180
    //% group="Cơ cấu chấp hành (PCA9685)"
    export function servoPCA9685(channel: ServoChannel, degree: number): void {
        if (!initialized) initPCA9685();
        let v_us = (degree * 1800 / 180 + 600);
        let value = v_us * 4096 / 20000;
        setPwm(channel, 0, value);
    }

    //% block="Servo PCA9685 |%channel| xuất xung %pulse"
    //% weight=98
    //% pulse.min=500 pulse.max=2500
    //% group="Cơ cấu chấp hành (PCA9685)"
    export function servoPulsePCA9685(channel: ServoChannel, pulse: number): void {
        if (!initialized) initPCA9685();
        let value = pulse * 4096 / 20000;
        setPwm(channel, 0, value);
    }

    //% block="Quay servo chân %pin góc %angle độ"
    //% angle.min=0 angle.max=180
    //% group="Cơ cấu chấp hành"
    //% weight=95
    export function servoControl(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle);
    }

    //% block="siêu âm chân TRIG %trig ECHO %echo đơn vị cm"
    //% weight=94
    //% group="Cảm biến"
    export function readUltrasonic(trig: DigitalPin, echo: DigitalPin): number {
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);

        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        let data = pins.pulseIn(echo, PulseValue.High, 30000);

        if (data == 0) {
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            data = pins.pulseIn(echo, PulseValue.High, 30000);
        }

        let distance = data / 58;

        if (distance <= 0 || distance > 400) {
            return 400;
        }

        return Math.round(distance);
    }
}