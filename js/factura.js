let productos = [];
const url = "api/productos.json";

// Variante de función getJSONData. Estaban utilizando fetch en crudo, por eso
//animé a reutilizar código.
let obtener = (url) => {
  var resultado = {};
  return fetch(url)
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else {
        throw Error(respuesta.statusText);
      }
    })
    .then((respuesta) => {
      resultado.status = "ok";
      resultado.data = respuesta;

      return resultado;
    })
    .catch((error) => {
      resultado.status = "error";
      resultado.data = error;

      return resultado;
    });
};
//Función que carga los productos a la lista desplegable
function cargarProductos(listaProductos) {
  let producto = document.getElementById("producto");
  for (let elemento of listaProductos) {
    producto.innerHTML += `<option value= ${elemento.producto} -  ${elemento.precio}>${elemento.producto} -  ${elemento.precio} </option>`;
  }
}
function recalcular() {
  let cantidades = document.getElementsByClassName("cant");
  let precios = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  var total = 0;
  console.log("Total es: " + typeof total);
  for (let i = 0; i < precios.length; i++) {
    total += parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    );

    resultados[i].innerHTML = parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    ).toFixed(2);
    console.log("Peero el programa dice que total ahora es: " + typeof total);
  }
  console.log("Total ahora es:" + typeof total);
  document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}
function agregarALista() {
  let cant = parseInt(document.getElementById("cantidad").value);
  let lista = document.getElementById("lista"); //tomo el tbody
  let index = document.getElementById("producto").selectedIndex; //tomo el índice
  //del producto seleccionado.
  lista.innerHTML += `<tr ><td class="articulo">${
    productos[index].producto
  } </td><td>$ <span class="precio">${
    productos[index].precio
  }</span></td><td><input type="number" class="form-control cant" value="${cant}" onchange="recalcular();" ></td><td>$ <span class="res">${(
    cant * productos[index].precio
  ).toFixed(
    2
  )}</span></td><td><img src="/img/borrar.png" width="20"><span></td></tr>`;
  recalcular();
}

function imprimirTicket() {
  let doc = new jsPDF();
  let cant = parseInt(document.getElementById("cantidad").value);

  let articulos = document.getElementsByClassName("articulo");
  let cantidad = document.getElementsByClassName("cant");
  let precio = document.getElementsByClassName("precio");
  let precioTotal = document.getElementsByClassName("res");

  let total = Array.from(precioTotal).reduce((cont, elemento) => {
    let valor = parseFloat(elemento.textContent);
    return cont + valor;
  }, 0);

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(80, 30, 'Ferreteria 267');

  doc.setFontSize(10)

  // Titulos
  doc.text(30, 44, 'Artículo');
  doc.text(124, 44, 'Ud');
  doc.text(135, 44, 'Precio');
  doc.text(155, 44, 'Total');
  doc.line(30, 47, 170, 47);
  
  let ejeY = 55;
  for (let i = 0; i < articulos.length; i++) {
    doc.text(30, ejeY, articulos[i].innerText.substring(0, 40));
    doc.text(125, ejeY, cantidad[i].value);
    doc.text(135, ejeY, "$" + precio[i].innerText);
    doc.text(155, ejeY, "$" + precioTotal[i].innerText);
    ejeY += 6;
  }

  doc.line(30, ejeY, 170, ejeY);
  doc.text(30, ejeY + 10, 'Total:');
  doc.text(155, ejeY + 10, "$" + total.toFixed(2));

  doc.save(cliente + ".pdf");
}

document.addEventListener("DOMContentLoaded", () => {
  obtener(url).then((resultado) => {
    //Agrego los productos a la lista
    if (resultado.status === "ok") {
      console.log(resultado.data);
      productos = resultado.data;
      cargarProductos(productos);
      console.log(productos);
    }
  });
  let btnAgregar = document.getElementById("agregar");
  btnAgregar.addEventListener("click", () => {
    agregarALista();
    //alert( document.getElementById('producto').selectedIndex);
  });

  let btnImprimir = document.getElementById("imp");
  btnImprimir.addEventListener("click", () => {
    imprimirTicket();
  });
});
