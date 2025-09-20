let symbole = [
    images.createImage(`
        . . . . .
        . # . # .
        . . # . .
        . # . # .
        . . . . .
    `), // Smiley
    images.createImage(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
    `), // Quadrat
    images.createImage(`
        . . # . .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
    `)  // Diamant
]

let geld = 50

// Animation: Symbol von unten nach oben „scrollen"
function scrollWalze(dauer: number): number {
    let ergebnis = randint(0, symbole.length - 1)
    let start = control.millis()
    while (control.millis() - start < dauer) {
        let zufall = randint(0, symbole.length - 1)
        for (let y = 4; y >= 0; y--) {
            basic.clearScreen()
            for (let px = 0; px < 5; px++) {
                for (let py = 0; py < 5; py++) {
                    if (symbole[zufall].pixel(px, py)) {
                        let ny = py + (y - 2)
                        if (ny >= 0 && ny < 5) {
                            led.plot(px, ny)
                        }
                    }
                }
            }
            basic.pause(60)
        }
    }
    return ergebnis
}

// Rand blinken lassen, Symbol bleibt in der Mitte
function blinkMitSymbol(symbol: Image, anzahl: number) {
    for (let i = 0; i < anzahl; i++) {
        symbol.showImage(0)
        basic.pause(200)
        // Symbol + Rand
        for (let px = 0; px < 5; px++) {
            for (let py = 0; py < 5; py++) {
                if (symbol.pixel(px, py)) {
                    led.plot(px, py)
                }
            }
        }
        for (let j = 0; j < 5; j++) {
            led.plot(j, 0)
            led.plot(j, 4)
            led.plot(0, j)
            led.plot(4, j)
        }
        basic.pause(200)
    }
}

// Eine Walze spielen
function spieleWalze(): number {
    let erg = scrollWalze(1500)
    blinkMitSymbol(symbole[erg], 3)
    return erg
}

// Jackpot-Feuerwerk
function jackpotFeuerwerk() {
    for (let runde = 0; runde < 3; runde++) {
        basic.clearScreen()
        led.plot(2, 2)
        basic.pause(150)
        basic.clearScreen()
        led.plot(1, 2)
        led.plot(3, 2)
        led.plot(2, 1)
        led.plot(2, 3)
        basic.pause(150)
        basic.clearScreen()
        led.plot(0, 2)
        led.plot(4, 2)
        led.plot(2, 0)
        led.plot(2, 4)
        led.plot(1, 1)
        led.plot(3, 1)
        led.plot(1, 3)
        led.plot(3, 3)
        basic.pause(150)
        basic.clearScreen()
        for (let i = 0; i < 6; i++) {
            led.plot(randint(0, 4), randint(0, 4))
        }
        basic.pause(200)
    }
    basic.showIcon(IconNames.Happy)
}

// Verlustanimation
function verlierAnimation() {
    for (let i = 0; i < 2; i++) {
        basic.clearScreen()
        basic.pause(100)
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if ((x + y) % 2 == 0) led.plot(x, y)
            }
        }
        basic.pause(100)
    }
}

// Kontostand anzeigen
function zeigeGeld() {
    basic.clearScreen()
    // Geldsymbol in der Mitte
    led.plot(2, 1)
    led.plot(1, 2)
    led.plot(2, 2)
    led.plot(3, 2)
    led.plot(2, 3)
    basic.showNumber(geld)
}

// Taste A: normale Slot Machine
input.onButtonPressed(Button.A, function () {
    let e1 = spieleWalze()
    let e2 = spieleWalze()
    let e3 = spieleWalze()

    if (e1 == e2 && e2 == e3) {
        jackpotFeuerwerk()
        geld += 10
    } else {
        verlierAnimation()
        basic.showIcon(IconNames.Sad)
        geld -= 5
    }
    zeigeGeld()
})

// Taste B: garantierter Jackpot, Animation wie A, kein Geld verändert
input.onButtonPressed(Button.B, function () {
    let jackpotSymbol = randint(0, symbole.length - 1)

    // Animation wie bei A: scrollen jeder Walze
    for (let i = 0; i < 3; i++) {
        scrollWalze(1500)
    }

    // Blinken des Symbols 3x pro Walze
    blinkMitSymbol(symbole[jackpotSymbol], 3)
    blinkMitSymbol(symbole[jackpotSymbol], 3)
    blinkMitSymbol(symbole[jackpotSymbol], 3)

    // Jackpot-Feuerwerk starten
    jackpotFeuerwerk()

    // Kontostand zeigen, bleibt gleich
    zeigeGeld()
})

// Taste A+B: Kontostand anzeigen (nur Geldsymbol)
input.onButtonPressed(Button.AB, function () {
    zeigeGeld()
})