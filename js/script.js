'use strict';

dayjs.extend(dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_duration);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);
dayjs.locale('es');

// ==================================================
// PUNTO 1: EDAD EN COSAS RARAS
// ==================================================

function contarViernes13(fechaIncio, fechaFin) {
  let contador = 0;

  let fecha = fechaIncio.startOf('day');

  while (fecha.isBefore(fechaFin) || fecha.isSame(fechaFin, 'day')) {
    if (fecha.day() === 5 && fecha.date() === 13) {
      contador++;
    }

    fecha = fecha.add(1, 'day')

  }
  return contador;

}

function calcularEdad(fechaNacimiento) {

  let ahora = dayjs();


  return {
    dias: ahora.diff(fechaNacimiento, 'day'),
    horas: ahora.diff(fechaNacimiento, 'hour'),
    segundos: ahora.diff(fechaNacimiento, 'second'),
    viernes13: contarViernes13(fechaNacimiento, ahora),
    diaSemana: fechaNacimiento.format('dddd')


  };

}

function mostrarEdad(resultado, fechaNacimiento) {
  document.getElementById('dias-edad').textContent = resultado.dias;
  document.getElementById('horas-edad').textContent = resultado.horas;
  document.getElementById('segundos-edad').textContent = resultado.segundos;

  document.getElementById("dia-semana").textContent = resultado.diaSemana;
  document.getElementById("viernes").textContent = resultado.viernes13;

  document.getElementById("resultado-edad").hidden = false;
}

function procesarFormularioEdad(e) {
  e.preventDefault();

  let input = document.getElementById('nacimiento');
  let error = document.getElementById('error-edad');
  let resultado = document.getElementById('resultado-edad');

  error.textContent = '';
  input.removeAttribute('aria-invalid');

  if (input.value === '') {
    error.textContent = 'Introduce una fecha de nacimiento.';
    input.setAttribute('aria-invalid', 'true');
    resultado.hidden = true;
    return;
  }

  let fechaNacimiento = dayjs(input.value).startOf('day');

  if (!fechaNacimiento.isValid()) {
    error.textContent = 'La fecha introducida no es válida.';
    input.setAttribute('aria-invalid', 'true');
    resultado.hidden = true;
    return;
  }

  if (fechaNacimiento.isAfter(dayjs())) {
    error.textContent = 'La fecha de nacimiento no puede ser futura.';
    input.setAttribute('aria-invalid', 'true');
    resultado.hidden = true;
    return;
  }

  let datos = calcularEdad(fechaNacimiento);
  mostrarEdad(datos);
}

function iniciarEdad() {
  let formulario = document.getElementById('form-edad');

  formulario.addEventListener('submit', procesarFormularioEdad);
}

// ==================================================
// PUNTO 2: CUENTA ATRÁS
// ==================================================

function actualizarCuentaAtras() {
  let ahora = dayjs();
  let destino = dayjs().add(1, 'year').startOf('year');
  let diferencia = destino.diff(ahora);

  document.getElementById('fecha-evento').textContent =
    'Año Nuevo: ' + destino.format('DD/MM/YYYY HH:mm:ss');

  let contador = document.getElementById('contador');
  let estado = document.getElementById('estado-evento');

  if (diferencia <= 0) {
    contador.textContent = '';
    estado.textContent = '¡El evento ha llegado!';
    return;
  }

  let dias = Math.floor(diferencia / 86400000);
  let horas = Math.floor(diferencia / 3600000) % 24;
  let minutos = Math.floor(diferencia / 60000) % 60;
  let segundos = Math.floor(diferencia / 1000) % 60;

  contador.textContent =
    `Faltan ${dias} días, ${horas} horas, ` +
    `${minutos} minutos y ${segundos} segundos para Año Nuevo.`;

  estado.textContent = '';
}


function iniciarCuentaAtras() {
  actualizarCuentaAtras();
}

// ==================================================
// PUNTO 3: ZONAS HORARIAS
// ==================================================

function actualizarZonasHorarias() {
  let ahora = dayjs();

  document.getElementById('hora-local').textContent =
    ahora.format('DD/MM/YYYY HH:mm:ss');

  document.getElementById('hora-tokio').textContent =
    ahora.tz('Asia/Tokyo').format('DD/MM/YYYY HH:mm:ss');

  document.getElementById('hora-nueva-york').textContent =
    ahora.tz('America/New_York').format('DD/MM/YYYY HH:mm:ss');

  document.getElementById('hora-sidney').textContent =
    ahora.tz('Australia/Sydney').format('DD/MM/YYYY HH:mm:ss');
}

// ==================================================
// INICIO Y ACTUALIZACIÓN COMÚN
// ==================================================

function actualizarRelojes() {
  actualizarCuentaAtras();
  actualizarZonasHorarias();
}

iniciarEdad();
iniciarCuentaAtras();

// Ejecutamos la función nada más empezar y creamos un intervalo
actualizarRelojes();
// Un intervalo permite ejecutar una función cada x segundos (1000ms == 1seg)
setInterval(actualizarRelojes, 1000);

