const form = document.getElementById('formIngreso');
const resumenErrores = document.getElementById('resumenErrores');
const confirmacion = document.getElementById('confirmacion');
const empresaCampos = document.getElementById('empresaCampos');
const tipoDispositivo = document.getElementById('tipoDispositivo');
const otroDispositivo = document.getElementById('otroDispositivo');
const marcaEquipo = document.getElementById('marcaEquipo');
const otraMarca = document.getElementById('otraMarca');
const garantiaVigente = document.getElementById('garantiaVigente');
const garantiaCampos = document.getElementById('garantiaCampos');
const reparadoAntes = document.getElementById('reparadoAntes');
const detalleReparacion = document.getElementById('detalleReparacion');
const direccionDomicilio = document.getElementById('direccionDomicilio');
const descripcionProblema = document.getElementById('descripcionProblema');
const detalleReparacionTexto = document.getElementById('detalleReparacionTexto');
const contadorDescripcion = document.getElementById('contadorDescripcion');
const contadorDetalle = document.getElementById('contadorDetalle');
const campos = {
  nombre: form.elements['nombre'],
  dni: form.elements['dni'],
  email: form.elements['email'],
  emailConfirm: form.elements['emailConfirm'],
  telefono: form.elements['telefono'],
  empresaNombre: form.elements['empresaNombre'],
  empresaCuit: form.elements['empresaCuit'],
  provincia: form.elements['provincia'],
  localidad: form.elements['localidad'],
  tipoDispositivo: form.elements['tipoDispositivo'],
  otroDispositivo: form.elements['otroDispositivo'],
  marca: form.elements['marca'],
  marcaOtra: form.elements['marcaOtra'],
  modelo: form.elements['modelo'],
  sistemaOperativo: form.elements['sistemaOperativo'],
  ordenCompra: form.elements['ordenCompra'],
  tipoProblema: form.elements['tipoProblema'],
  duracionProblema: form.elements['duracionProblema'],
  descripcionProblema: form.elements['descripcionProblema'],
  detalleReparacion: form.elements['detalleReparacion'],
  direccionDomicilio: form.elements['direccionDomicilio'],
  presupuesto: form.elements['presupuesto'],
  horarioContacto: form.elements['horarioContacto'],
  aceptaDiagnostico: form.elements['aceptaDiagnostico'],
  aceptaTerminos: form.elements['aceptaTerminos'],
  contacto: Array.from(form.querySelectorAll('input[name="contacto[]"]')),
  tipoCliente: Array.from(document.querySelectorAll('input[name="tipoCliente"]')),
  modalidadEntrega: Array.from(document.querySelectorAll('input[name="modalidadEntrega"]')),
  problemaPermanente: Array.from(document.querySelectorAll('input[name="problemaPermanente"]')),
};

let primerElementoConError = null;

function getFieldContainer(element) {
  return element.closest('label') || element.closest('fieldset') || element.parentElement;
}

function removeErrorMessage(container) {
  if (!container) return;
  const sibling = container.nextElementSibling;
  if (sibling && sibling.classList.contains('error-mensaje')) {
    sibling.remove();
  }
}

function clearFieldState(field) {
  if (!field) return;
  const container = getFieldContainer(field);
  removeErrorMessage(container);
  field.classList.remove('campo-error', 'campo-ok');
}

function clearGroupState(fieldsList) {
  fieldsList.forEach((field) => clearFieldState(field));
  const groupContainer = fieldsList[0] ? getFieldContainer(fieldsList[0]) : null;
  if (groupContainer && groupContainer.tagName === 'FIELDSET') {
    removeErrorMessage(groupContainer);
  }
}

function showError(containerOrField, message) {
  const container = containerOrField instanceof HTMLElement && (containerOrField.tagName === 'FIELDSET' || containerOrField.tagName === 'LABEL')
    ? containerOrField
    : getFieldContainer(containerOrField);

  if (!container) return;
  removeErrorMessage(container);

  if (containerOrField instanceof HTMLInputElement || containerOrField instanceof HTMLSelectElement || containerOrField instanceof HTMLTextAreaElement) {
    containerOrField.classList.add('campo-error');
    containerOrField.classList.remove('campo-ok');
  }

  if (container.tagName === 'FIELDSET') {
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.classList.add('campo-error');
      input.classList.remove('campo-ok');
    });
  }

  const errorElement = document.createElement('div');
  errorElement.className = 'error-mensaje';
  errorElement.textContent = message;
  container.insertAdjacentElement('afterend', errorElement);
}

function setValid(field) {
  if (!field) return;
  const container = getFieldContainer(field);
  removeErrorMessage(container);
  field.classList.remove('campo-error');
  field.classList.add('campo-ok');
}

function setGroupValid(fieldsList) {
  fieldsList.forEach((field) => {
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
  });
  const container = getFieldContainer(fieldsList[0]);
  if (container && container.tagName === 'FIELDSET') {
    removeErrorMessage(container);
  }
}

function focusError(target) {
  if (!target) return;
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
    target.focus();
    return;
  }
  const focusable = target.querySelector('input, select, textarea');
  if (focusable) focusable.focus();
}

function isVisible(element) {
  return element.offsetParent !== null;
}

function markInvalid(target, message) {
  if (!primerElementoConError) {
    primerElementoConError = target;
  }

  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
    showError(target, message);
  } else {
    showError(target, message);
  }

  return false;
}

function updateContador(textarea, contador) {
  const longitud = textarea.value.length;
  const max = textarea.maxLength;
  contador.textContent = `${longitud} / ${max}`;
  contador.classList.remove('contador-naranja', 'contador-rojo');

  if (longitud >= max) {
    contador.classList.add('contador-rojo');
  } else if (longitud >= Math.floor(max * 0.8)) {
    contador.classList.add('contador-naranja');
  }
}

function actualizarEmpresa() {
  const seleccion = campos.tipoCliente.find((radio) => radio.checked);
  const visible = seleccion && seleccion.value === 'Empresa';
  empresaCampos.style.display = visible ? 'grid' : 'none';
  campos.empresaNombre.required = visible;
  campos.empresaCuit.required = visible;

  if (!visible) {
    campos.empresaNombre.value = '';
    campos.empresaCuit.value = '';
    clearFieldState(campos.empresaNombre);
    clearFieldState(campos.empresaCuit);
  }
}

function actualizarDispositivo() {
  const visible = tipoDispositivo.value === 'Otro';
  otroDispositivo.style.display = visible ? 'grid' : 'none';
  campos.otroDispositivo.required = visible;

  if (!visible) {
    campos.otroDispositivo.value = '';
    clearFieldState(campos.otroDispositivo);
  }
}

function actualizarMarca() {
  const visible = marcaEquipo.value === 'Otra';
  otraMarca.style.display = visible ? 'grid' : 'none';
  campos.marcaOtra.required = visible;

  if (!visible) {
    campos.marcaOtra.value = '';
    clearFieldState(campos.marcaOtra);
  }
}

function actualizarGarantia() {
  const visible = garantiaVigente.checked;
  garantiaCampos.style.display = visible ? 'block' : 'none';
  if (campos.ordenCompra) campos.ordenCompra.required = visible;

  if (!visible && campos.ordenCompra) {
    campos.ordenCompra.value = '';
    clearFieldState(campos.ordenCompra);
  }
}

function actualizarReparadoAntes() {
  const visible = reparadoAntes.checked;
  detalleReparacion.style.display = visible ? 'block' : 'none';

  if (!visible) {
    detalleReparacionTexto.value = '';
    updateContador(detalleReparacionTexto, contadorDetalle);
    clearFieldState(detalleReparacionTexto);
  }
}

function actualizarEntrega() {
  const seleccion = campos.modalidadEntrega.find((radio) => radio.checked);
  const visible = seleccion && seleccion.value === 'Domicilio';
  direccionDomicilio.style.display = visible ? 'block' : 'none';
  campos.direccionDomicilio.required = visible;

  if (!visible) {
    campos.direccionDomicilio.value = '';
    clearFieldState(campos.direccionDomicilio);
  }
}

function clearAllErrors() {
  resumenErrores.style.display = 'none';
  resumenErrores.textContent = '';
  primerElementoConError = null;
  const errorElements = form.querySelectorAll('.error-mensaje');
  errorElements.forEach((node) => node.remove());
  const fieldsWithState = form.querySelectorAll('.campo-error, .campo-ok');
  fieldsWithState.forEach((field) => field.classList.remove('campo-error', 'campo-ok'));
}

function validarNombre() {
  const field = campos.nombre;
  clearFieldState(field);
  const value = field.value.trim();
  const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{5,80}$/;
  if (!value) return markInvalid(field, 'El nombre completo es obligatorio.');
  if (!regex.test(value)) return markInvalid(field, 'Solo se permiten letras y espacios. Minimo 5 caracteres y maximo 80.');
  setValid(field);
  return true;
}

function validarDni() {
  const field = campos.dni;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El DNI es obligatorio.');
  if (!/^[0-9]{7,8}$/.test(value)) return markInvalid(field, 'El DNI debe tener solo numeros y entre 7 y 8 digitos.');
  setValid(field);
  return true;
}

function validarEmail() {
  const field = campos.email;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El correo electrónico es obligatorio.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return markInvalid(field, 'Ingrese un correo electrónico válido con @ y dominio.');
  setValid(field);
  return true;
}

function validarConfirmEmail() {
  const field = campos.emailConfirm;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'Debe confirmar el correo electrónico.');
  if (value !== campos.email.value.trim()) return markInvalid(field, 'El correo de confirmación debe coincidir exactamente con el correo electrónico.');
  setValid(field);
  return true;
}

function validarTelefono() {
  const field = campos.telefono;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El teléfono de contacto es obligatorio.');
  if (!/^[0-9+\-\s]+$/.test(value)) return markInvalid(field, 'Solo se permiten digitos, guiones, espacios y el signo +.');
  const digitos = value.replace(/\D/g, '').length;
  if (digitos < 8) return markInvalid(field, 'El teléfono debe tener al menos 8 digitos numéricos.');
  setValid(field);
  return true;
}

function validarTipoCliente() {
  const fieldset = document.querySelector('fieldset[aria-label="Tipo de cliente"]');
  clearGroupState(campos.tipoCliente);
  const seleccion = campos.tipoCliente.find((radio) => radio.checked);
  if (!seleccion) return markInvalid(fieldset, 'Debe seleccionar un tipo de cliente.');
  setGroupValid(campos.tipoCliente);
  if (seleccion.value === 'Empresa') {
    return validarEmpresaNombre() && validarEmpresaCuit();
  }
  return true;
}

function validarEmpresaNombre() {
  const field = campos.empresaNombre;
  if (!isVisible(field)) {
    clearFieldState(field);
    return true;
  }
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El nombre de la empresa es obligatorio.');
  setValid(field);
  return true;
}

function validarEmpresaCuit() {
  const field = campos.empresaCuit;
  if (!isVisible(field)) {
    clearFieldState(field);
    return true;
  }
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El CUIT es obligatorio.');
  if (!/^(\d{2}-\d{8}-\d|\d{11})$/.test(value)) return markInvalid(field, 'El CUIT debe tener formato ##-########-# o 11 digitos seguidos.');
  setValid(field);
  return true;
}

function validarProvincia() {
  const field = campos.provincia;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'La provincia es obligatoria.');
  setValid(field);
  return true;
}

function validarLocalidad() {
  const field = campos.localidad;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'La localidad es obligatoria.');
  if (value.length < 2) return markInvalid(field, 'La localidad debe tener al menos 2 caracteres.');
  setValid(field);
  return true;
}

function validarTipoDispositivo() {
  const field = campos.tipoDispositivo;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'El tipo de dispositivo es obligatorio.');
  setValid(field);
  if (field.value === 'Otro') {
    return validarOtroDispositivo();
  }
  return true;
}

function validarOtroDispositivo() {
  const field = campos.otroDispositivo;
  clearFieldState(field);
  if (!isVisible(field)) return true;
  if (!field.value.trim()) return markInvalid(field, 'Debe especificar el dispositivo cuando selecciona "Otro".');
  setValid(field);
  return true;
}

function validarMarca() {
  const field = campos.marca;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'La marca es obligatoria.');
  setValid(field);
  if (field.value === 'Otra') {
    return validarMarcaOtra();
  }
  return true;
}

function validarMarcaOtra() {
  const field = campos.marcaOtra;
  clearFieldState(field);
  if (!isVisible(field)) return true;
  if (!field.value.trim()) return markInvalid(field, 'Debe ingresar la marca cuando selecciona "Otra".');
  setValid(field);
  return true;
}

function validarModelo() {
  const field = campos.modelo;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'El modelo es obligatorio.');
  if (value.length < 2) return markInvalid(field, 'El modelo debe tener al menos 2 caracteres.');
  setValid(field);
  return true;
}

function validarSistemaOperativo() {
  const field = campos.sistemaOperativo;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'El sistema operativo es obligatorio.');
  setValid(field);
  return true;
}

function validarOrdenCompra() {
  const field = campos.ordenCompra;
  if (!isVisible(field)) {
    clearFieldState(field);
    return true;
  }
  clearFieldState(field);
  if (!field.value.trim()) return markInvalid(field, 'El número de orden o fecha de compra es obligatorio con garantía vigente.');
  setValid(field);
  return true;
}

function validarTipoProblema() {
  const field = campos.tipoProblema;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'El tipo de problema es obligatorio.');
  setValid(field);
  return true;
}

function validarDuracionProblema() {
  const field = campos.duracionProblema;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'Debe indicar desde cuándo ocurre el problema.');
  setValid(field);
  return true;
}

function validarProblemaPermanente() {
  const fieldset = document.querySelector('fieldset[aria-label="Tipo de problema permanente o intermitente"]');
  clearGroupState(campos.problemaPermanente);
  const seleccion = campos.problemaPermanente.find((radio) => radio.checked);
  if (!seleccion) return markInvalid(fieldset, 'Debe seleccionar si el problema es permanente o intermitente.');
  setGroupValid(campos.problemaPermanente);
  return true;
}

function validarDescripcionProblema() {
  const field = campos.descripcionProblema;
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'La descripción del problema es obligatoria.');
  if (value.length < 20) return markInvalid(field, 'La descripción debe tener al menos 20 caracteres.');
  if (value.length > 500) return markInvalid(field, 'La descripción no puede superar los 500 caracteres.');
  setValid(field);
  return true;
}

function validarDetalleReparacion() {
  const field = campos.detalleReparacion;
  if (!isVisible(field)) {
    clearFieldState(field);
    return true;
  }
  clearFieldState(field);
  if (field.value.length > 300) return markInvalid(field, 'El texto de reparación previa no puede superar los 300 caracteres.');
  setValid(field);
  return true;
}

function validarModalidadEntrega() {
  const fieldset = document.querySelector('fieldset[aria-label="Modalidad de entrega"]');
  clearGroupState(campos.modalidadEntrega);
  const seleccion = campos.modalidadEntrega.find((radio) => radio.checked);
  if (!seleccion) return markInvalid(fieldset, 'Debe seleccionar la modalidad de entrega.');
  setGroupValid(campos.modalidadEntrega);
  if (seleccion.value === 'Domicilio') {
    return validarDireccionDomicilio();
  }
  return true;
}

function validarDireccionDomicilio() {
  const field = campos.direccionDomicilio;
  if (!isVisible(field)) {
    clearFieldState(field);
    return true;
  }
  clearFieldState(field);
  const value = field.value.trim();
  if (!value) return markInvalid(field, 'La dirección completa es obligatoria para retiro a domicilio.');
  if (value.length < 10) return markInvalid(field, 'La dirección debe tener al menos 10 caracteres.');
  setValid(field);
  return true;
}

function validarPresupuesto() {
  const field = campos.presupuesto;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'Debe seleccionar un presupuesto autorizado.');
  setValid(field);
  return true;
}

function validarContacto() {
  const fieldset = document.querySelector('fieldset[aria-label="Preferencia de contacto"]');
  clearGroupState(campos.contacto);
  const seleccion = campos.contacto.some((checkbox) => checkbox.checked);
  if (!seleccion) return markInvalid(fieldset, 'Debe seleccionar al menos una preferencia de contacto.');
  setGroupValid(campos.contacto);
  return true;
}

function validarHorarioContacto() {
  const field = campos.horarioContacto;
  clearFieldState(field);
  if (!field.value) return markInvalid(field, 'Debe seleccionar un horario preferido para el contacto.');
  setValid(field);
  return true;
}

function validarAceptaDiagnostico() {
  const fieldset = document.querySelector('label input[name="aceptaDiagnostico"]').closest('label');
  const field = campos.aceptaDiagnostico;
  clearFieldState(field);
  if (!field.checked) return markInvalid(fieldset, 'Debe aceptar que el diagnóstico puede demorar hasta 48 horas hábiles.');
  setValid(field);
  return true;
}

function validarAceptaTerminos() {
  const fieldset = document.querySelector('label input[name="aceptaTerminos"]').closest('label');
  const field = campos.aceptaTerminos;
  clearFieldState(field);
  if (!field.checked) return markInvalid(fieldset, 'Debe aceptar los Términos y Condiciones.');
  setValid(field);
  return true;
}

function validarFormulario(event) {
  event.preventDefault();
  clearAllErrors();
  primerElementoConError = null;

  const validaciones = [
    validarNombre,
    validarDni,
    validarEmail,
    validarConfirmEmail,
    validarTelefono,
    validarTipoCliente,
    validarProvincia,
    validarLocalidad,
    validarTipoDispositivo,
    validarMarca,
    validarModelo,
    validarSistemaOperativo,
    validarOrdenCompra,
    validarTipoProblema,
    validarDuracionProblema,
    validarProblemaPermanente,
    validarDescripcionProblema,
    validarDetalleReparacion,
    validarModalidadEntrega,
    validarPresupuesto,
    validarContacto,
    validarHorarioContacto,
    validarAceptaDiagnostico,
    validarAceptaTerminos,
  ];

  const resultados = validaciones.map((fn) => fn());
  const errores = resultados.filter((resultado) => resultado === false).length;

  if (errores > 0) {
    resumenErrores.textContent = `Se encontraron ${errores} ${errores === 1 ? 'error' : 'errores'}. Revise los campos marcados.`;
    resumenErrores.style.display = 'block';
    if (primerElementoConError) {
      primerElementoConError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusError(primerElementoConError);
    }
    return;
  }

  mostrarConfirmacion();
}

function mostrarConfirmacion() {
  form.style.display = 'none';
  resumenErrores.style.display = 'none';
  const nombre = campos.nombre.value.trim();
  const dispositivo = tipoDispositivo.value === 'Otro' ? campos.otroDispositivo.value.trim() : tipoDispositivo.value;
  const marca = marcaEquipo.value === 'Otra' ? campos.marcaOtra.value.trim() : marcaEquipo.value;
  const modelo = campos.modelo.value.trim();
  const modalidadSeleccionada = campos.modalidadEntrega.find((radio) => radio.checked);
  const modalidad = modalidadSeleccionada && modalidadSeleccionada.value === 'Domicilio'
    ? 'Solicito retiro a domicilio'
    : 'Lo llevo personalmente al local';
  const numeroOrden = Math.floor(Math.random() * 900000) + 100000;

  confirmacion.innerHTML = `
    <h2 class="confirmacion__titulo">Ingreso registrado con éxito</h2>
    <div class="confirmacion__detalle">
      <p>Gracias, <strong>${nombre}</strong>. Recibimos los datos de su equipo.</p>
      <p><strong>Dispositivo:</strong> ${dispositivo}</p>
      <p><strong>Marca y modelo:</strong> ${marca} / ${modelo}</p>
      <p><strong>Modalidad de entrega:</strong> ${modalidad}</p>
      <p>Su número de orden de ingreso es <strong>${numeroOrden}</strong>. En hasta 48 horas hábiles, el equipo será diagnosticado.</p>
    </div>
    <div class="confirmacion__acciones">
      <button type="button" id="btnIngresarOtro" class="boton boton--principal">Ingresar otro equipo</button>
      <a class="boton boton--secundario enlace-inicio" href="index.html">Volver al inicio</a>
    </div>
  `;
  confirmacion.style.display = 'block';
  const botonRecargar = document.getElementById('btnIngresarOtro');
  botonRecargar.addEventListener('click', () => window.location.reload());
}

function resetFormulario() {
  setTimeout(() => {
    clearAllErrors();
    resumenErrores.style.display = 'none';
    confirmacion.style.display = 'none';
    form.style.display = 'block';
    actualizarEmpresa();
    actualizarDispositivo();
    actualizarMarca();
    actualizarGarantia();
    actualizarReparadoAntes();
    actualizarEntrega();
    updateContador(descripcionProblema, contadorDescripcion);
    updateContador(detalleReparacionTexto, contadorDetalle);
  }, 0);
}

campos.nombre.addEventListener('blur', validarNombre);
campos.dni.addEventListener('blur', validarDni);
campos.email.addEventListener('blur', validarEmail);
campos.emailConfirm.addEventListener('blur', validarConfirmEmail);
campos.telefono.addEventListener('blur', validarTelefono);
campos.provincia.addEventListener('change', validarProvincia);
campos.localidad.addEventListener('blur', validarLocalidad);
campos.tipoCliente.forEach((radio) => radio.addEventListener('change', () => {
  actualizarEmpresa();
  validarTipoCliente();
}));

campos.tipoDispositivo.addEventListener('change', () => {
  actualizarDispositivo();
  validarTipoDispositivo();
});
campos.marca.addEventListener('change', () => {
  actualizarMarca();
  validarMarca();
});
campos.modelo.addEventListener('blur', validarModelo);
campos.sistemaOperativo.addEventListener('change', validarSistemaOperativo);
if (campos.ordenCompra) campos.ordenCompra.addEventListener('blur', validarOrdenCompra);
campos.tipoProblema.addEventListener('change', validarTipoProblema);
campos.duracionProblema.addEventListener('change', validarDuracionProblema);
campos.problemaPermanente.forEach((radio) => radio.addEventListener('change', validarProblemaPermanente));
campos.descripcionProblema.addEventListener('input', () => {
  updateContador(campos.descripcionProblema, contadorDescripcion);
});
reparadoAntes.addEventListener('change', () => {
  actualizarReparadoAntes();
  validarDetalleReparacion();
});
campos.detalleReparacion.addEventListener('input', () => {
  updateContador(campos.detalleReparacion, contadorDetalle);
});
campos.modalidadEntrega.forEach((radio) => radio.addEventListener('change', () => {
  actualizarEntrega();
  validarModalidadEntrega();
}));
campos.direccionDomicilio.addEventListener('blur', validarDireccionDomicilio);
campos.presupuesto.addEventListener('change', validarPresupuesto);
campos.contacto.forEach((checkbox) => checkbox.addEventListener('change', validarContacto));
campos.horarioContacto.addEventListener('change', validarHorarioContacto);
campos.aceptaDiagnostico.addEventListener('change', validarAceptaDiagnostico);
campos.aceptaTerminos.addEventListener('change', validarAceptaTerminos);
form.addEventListener('submit', validarFormulario);
form.addEventListener('reset', resetFormulario);

actualizarEmpresa();
actualizarDispositivo();
actualizarMarca();
actualizarGarantia();
actualizarReparadoAntes();
actualizarEntrega();
updateContador(campos.descripcionProblema, contadorDescripcion);
updateContador(campos.detalleReparacion, contadorDetalle);
