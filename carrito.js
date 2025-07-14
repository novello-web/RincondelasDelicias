let carrito = {};
let productoActual = '';
let necesitaSalsa = false;
let necesitaGuarnicion = false;

// ------------ Sincronización localStorage ------------
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito = JSON.parse(guardado);
  }
}
cargarCarrito(); // Cargar al iniciar

// ------------------------ tu código original ------------------------

const productosConGuarnicion = [/*...*/]; // igual que antes
const productosConSalsa = [/*...*/];
const salsas = [/*...*/];
const guarniciones = [/*...*/];
const salsasCarneTernera = [/*...*/];
const salsasPastas = [/*...*/];
const carneCerdoItems = [/*...*/];
const carneTerneraItems = [/*...*/];
const pastasItems = [/*...*/];
const productosGuarnicionReducida = [/*...*/];

function agregarAlCarrito(producto) {
  productoActual = producto;
  necesitaSalsa = productosConSalsa.some(p => producto.includes(p)) && !carneCerdoItems.some(p => producto.includes(p));
  necesitaGuarnicion = productosConGuarnicion.some(p => producto.includes(p));
  const modalOpciones = document.getElementById('modal-opciones');

  if (modalOpciones && (necesitaSalsa || necesitaGuarnicion)) {
    mostrarModalOpciones(producto);
  } else {
    agregarProductoAlCarrito(producto);
    mostrarNotificacion(` ✅Agregado al carrito.`);
  }
}

function mostrarModalOpciones(producto) {
  // igual que antes...
}

function confirmarAgregar() {
  let final = productoActual;
  const salsa = document.getElementById('select-salsa').value;
  const guarnicion = document.getElementById('select-guarnicion').value;

  if (salsa) final += ` (con ${salsa})`;
  if (guarnicion) final += ` (con ${guarnicion})`;

  agregarProductoAlCarrito(final);
  cerrarOpciones();
  mostrarNotificacion(`✅Agregado al carrito.`);
}

function agregarProductoAlCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]++;
  } else {
    carrito[producto] = 1;
  }
  guardarCarrito(); // 🟢 sincroniza
}

function mostrarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const botonVaciar = document.getElementById('borrar-carrito');
  lista.innerHTML = '';

  if (Object.keys(carrito).length === 0) {
    lista.innerHTML = '<li class="listovich">El carrito está vacío.</li>';
    botonVaciar.classList.add('oculto');
  } else {
    for (let p in carrito) {
      const li = document.createElement('li');
      li.classList.add('item-carrito');
      li.innerHTML = `
        ${p} x${carrito[p]} 
        <button class="btn-eliminar" onclick="eliminarDelCarrito('${p.replace(/'/g, "\\'")}')">❌</button>
      `;
      lista.appendChild(li);
    }
    botonVaciar.classList.remove('oculto');
  }

  document.getElementById('modal-carrito').classList.remove('oculto');
}

function eliminarDelCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]--;
    if (carrito[producto] <= 0) {
      delete carrito[producto];
    }
  }
  guardarCarrito(); // 🟢 sincroniza
  mostrarCarrito();
}

document.getElementById('borrar-carrito').addEventListener('click', () => {
  if (Object.keys(carrito).length === 0) {
    alert("El carrito ya está vacío.");
    return;
  }

  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    carrito = {};
    guardarCarrito(); // 🟢 sincroniza
    mostrarCarrito();
    mostrarNotificacion("🗑️ Carrito vaciado.");
  }
});

function cerrarCarrito() {
  document.getElementById('modal-carrito').classList.add('oculto');
}

function cerrarOpciones() {
  document.getElementById('modal-opciones').classList.add('oculto');
}

function enviarWhatsApp() {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  let mensaje = 'Hola! Quisiera pedir:\n';
  for (let p in carrito) {
    mensaje += `- ${p} x${carrito[p]}\n`;
  }

  const numero = '5493534766302';
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

function mostrarNotificacion(texto) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;

  noti.textContent = texto;
  noti.classList.remove("oculto");
  noti.classList.add("visible");

  setTimeout(() => {
    noti.classList.remove("visible");
    setTimeout(() => noti.classList.add("oculto"), 500);
  }, 2000);
}
