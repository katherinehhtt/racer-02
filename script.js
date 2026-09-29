/* ==================================
   RACER 02
   30.09.2026
================================== */


/* ==================================
   ELEMENTOS
================================== */

const inicio =
    document.getElementById("inicio");

const carrera =
    document.getElementById("carrera");

const meta =
    document.getElementById("meta");

const regalo =
    document.getElementById("regalo");

const revelacion =
    document.getElementById("revelacion");


const botonArrancar =
    document.getElementById("botonArrancar");

const pedal =
    document.getElementById("pedal");

const descubrir =
    document.getElementById("descubrir");

const cajaRegalo =
    document.getElementById("cajaRegalo");


const auto =
    document.getElementById("auto");

const pista =
    document.getElementById("pista");

const humo =
    document.getElementById("humo");

const destelloMeta =
    document.getElementById("destelloMeta");


const cuenta =
    document.getElementById("cuentaRegresiva");

const velocidadTexto =
    document.getElementById("velocidad");

const barraProgreso =
    document.getElementById("barraProgreso");

const instruccion =
    document.getElementById("instruccionPedal");


const sonidoMotor =
    document.getElementById("sonidoMotor");

const sonidoRuedas =
    document.getElementById("sonidoRuedas");


/* ==================================
   VARIABLES
================================== */

let velocidad = 0;

let progreso = 0;

let acelerando = false;

let carreraActiva = false;

let carreraTerminada = false;

let ultimoTiempo = 0;


/* VELOCIDAD MÁXIMA */

const velocidadMaxima = 180;


/* ==================================
   CAMBIAR DE PANTALLA
================================== */

function mostrar(pantalla) {

    document
        .querySelectorAll(".pantalla")
        .forEach(p => {

            p.classList.remove("activa");

        });


    pantalla.classList.add("activa");

}


/* ==================================
   BOTÓN ARRANCAR
================================== */

botonArrancar.addEventListener(
    "click",
    () => {

        mostrar(carrera);

        prepararCarrera();

    }
);


/* ==================================
   PREPARAR CARRERA
================================== */

function prepararCarrera() {

    velocidad = 0;

    progreso = 0;

    acelerando = false;

    carreraActiva = false;

    carreraTerminada = false;


    actualizarInterfaz();


    pedal.disabled = true;


    instruccion.innerText =
        "Prepárate...";


    /* MOTOR */

    sonidoMotor.currentTime = 0;

    sonidoMotor.volume = 0.65;


    sonidoMotor
        .play()
        .catch(() => {});


    /* CUENTA REGRESIVA */

    cuenta.innerText = "3";


    setTimeout(() => {

        cuenta.innerText = "2";

    }, 800);


    setTimeout(() => {

        cuenta.innerText = "1";

    }, 1600);


    setTimeout(() => {

        cuenta.innerText = "¡GO!";

    }, 2400);


    setTimeout(() => {

        cuenta.innerText = "";

        pedal.disabled = false;

        carreraActiva = true;


        instruccion.innerText =
            "Mantén presionado el pedal para acelerar.";


        ultimoTiempo =
            performance.now();


        requestAnimationFrame(
            bucleJuego
        );

    }, 3000);

}


/* ==================================
   PRESIONAR PEDAL
================================== */

function presionarPedal(evento) {

    if (evento) {

        evento.preventDefault();

    }


    if (
        !carreraActiva ||
        carreraTerminada
    ) {

        return;

    }


    acelerando = true;


    pedal.classList.add(
        "presionado"
    );


    pista.classList.add(
        "acelerando"
    );


    auto.classList.add(
        "motor-activo"
    );


    humo.classList.add(
        "activo"
    );


    if (sonidoRuedas.paused) {

        sonidoRuedas.volume = .35;


        sonidoRuedas
            .play()
            .catch(() => {});

    }

}


/* ==================================
   SOLTAR PEDAL
================================== */

function soltarPedal(evento) {

    if (evento) {

        evento.preventDefault();

    }


    acelerando = false;


    pedal.classList.remove(
        "presionado"
    );


    humo.classList.remove(
        "activo"
    );

}


/* ==================================
   CONTROLES PARA COMPUTADORA
================================== */

pedal.addEventListener(
    "mousedown",
    presionarPedal
);


window.addEventListener(
    "mouseup",
    soltarPedal
);


/* ==================================
   CONTROLES PARA CELULAR
================================== */

pedal.addEventListener(
    "touchstart",
    presionarPedal,
    {
        passive: false
    }
);


pedal.addEventListener(
    "touchend",
    soltarPedal,
    {
        passive: false
    }
);


/* ==================================
   POINTER EVENTS
================================== */

pedal.addEventListener(
    "pointerdown",
    presionarPedal
);


window.addEventListener(
    "pointerup",
    soltarPedal
);


/* ==================================
   BUCLE DEL JUEGO
================================== */

function bucleJuego(tiempoActual) {

    if (
        !carreraActiva ||
        carreraTerminada
    ) {

        return;

    }


    const delta =
        Math.min(

            (tiempoActual - ultimoTiempo)
            / 1000,

            .05

        );


    ultimoTiempo =
        tiempoActual;


    /* ==================================
       ACELERAR / DESACELERAR
    ================================== */

    if (acelerando) {

        velocidad +=
            70 * delta;

    }

    else {

        velocidad -=
            45 * delta;

    }


    /* ==================================
       LÍMITE DE VELOCIDAD
    ================================== */

    velocidad =
        Math.max(

            0,

            Math.min(
                velocidad,
                velocidadMaxima
            )

        );


    /* ==================================
       PROGRESO DE CARRERA
    ================================== */

    progreso +=

        (
            velocidad /
            velocidadMaxima
        )

        * 12

        * delta;


    progreso =
        Math.min(
            progreso,
            100
        );


    /* ==================================
       SONIDO SEGÚN VELOCIDAD
    ================================== */

    if (velocidad > 3) {


        if (sonidoRuedas.paused) {

            sonidoRuedas
                .play()
                .catch(() => {});

        }


        sonidoRuedas.volume =
            Math.min(

                .20 +
                velocidad / 400,

                .65

            );

    }

    else {

        sonidoRuedas.pause();

    }


    /* ==================================
       EFECTO ALTA VELOCIDAD
    ================================== */

    if (velocidad > 115) {

        pista.classList.add(
            "rapido"
        );

    }

    else {

        pista.classList.remove(
            "rapido"
        );

    }


    /* ==================================
       VIBRACIÓN DEL RACER
    ================================== */

    if (velocidad > 5) {

        auto.classList.add(
            "motor-activo"
        );

    }

    else {

        auto.classList.remove(
            "motor-activo"
        );

    }


    actualizarInterfaz();


    /* ==================================
       COMPROBAR META
    ================================== */

    if (progreso >= 100) {

        finalizarCarrera();

        return;

    }


    requestAnimationFrame(
        bucleJuego
    );

}


/* ==================================
   ACTUALIZAR PANTALLA
================================== */

function actualizarInterfaz() {


    velocidadTexto.innerText =
        Math.round(
            velocidad
        );


    barraProgreso.style.width =
        progreso + "%";


    /* AUTO AVANZA EN LA PISTA */

    const posicionAuto =

        15 +
        (
            progreso * .35
        );


    auto.style.left =

        Math.min(
            posicionAuto,
            50
        )

        + "%";

}


/* ==================================
   FINALIZAR CARRERA
================================== */

function finalizarCarrera() {


    carreraTerminada = true;

    carreraActiva = false;

    acelerando = false;


    pedal.disabled = true;


    /* DETENER SONIDO */

    sonidoRuedas.pause();

    sonidoRuedas.currentTime = 0;


    /* DETENER PISTA */

    pista.classList.remove(
        "acelerando"
    );


    pista.classList.remove(
        "rapido"
    );


    /* DETENER AUTO */

    auto.classList.remove(
        "motor-activo"
    );


    /* DETENER HUMO */

    humo.classList.remove(
        "activo"
    );


    velocidad = 0;


    /* DESTELLO DE META */

    destelloMeta.classList.add(
        "activo"
    );


    instruccion.innerText =
        "¡META! 🏁";


    /* MOSTRAR MENSAJE */

    setTimeout(() => {

        mostrar(meta);

    }, 900);

}


/* ==================================
   CONTINUAR AL REGALO
================================== */

descubrir.addEventListener(
    "click",
    () => {

        mostrar(regalo);

    }
);


/* ==================================
   ABRIR REGALO
================================== */

cajaRegalo.addEventListener(
    "click",
    () => {


        cajaRegalo.disabled =
            true;


        cajaRegalo.classList.add(
            "abriendo"
        );


        /* MOSTRAR MENSAJE FINAL */

        setTimeout(() => {

            mostrar(
                revelacion
            );

        }, 950);

    }
);


/* ==================================
   ABRIR CAJA
================================== */

cajaRegalo.addEventListener(
    "click",
    () => {

        cajaRegalo.disabled =
            true;


        cajaRegalo.classList.add(
            "abriendo"
        );


        setTimeout(() => {

            mostrar(
                revelacion
            );

        }, 950);

    }
);