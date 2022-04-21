const arrayProductos = [];
const arrayValores = [];

const IVASubTotal = [0,0,0];
const sinIVASubTotal = [0,0,0];
const arrayCantidad = [0,0,0];
const registroProducto = [0,0,0];

const keyValues =['keyValue0','keyValue1','keyValue2'];
const idValue = ['value0','value1','value2'];
const idProductos = ['valorBornera','valorPlc','valorFuente'];
  
let precioBornera=20;
let precioFuente=100;
let precioPLC=125;
let precioProducto = [precioBornera,precioPLC,precioFuente];
let dolarPrecio,cteMoneda;

class Producto{
  constructor(vProducto, vPrecio,vStock){
    this.Producto = vProducto;
    this.Precio = vPrecio;
    this.Stock= vStock;
  }
  conIVA(){
    return this.productIVA = this.Precio * 0.21;
  }
  sinIVA(){
    return this.productSinIVA = this.Precio;
  }
}

class Precios{
  constructor(vSubtotal,vIva,vTotal){
    this.ValorSubtotal = vSubtotal;
    this.ValorIva = vIva;
    this.ValorTotal = vTotal;
  }
}

arrayProductos.push(new Producto("Bornera",precioBornera,50));
arrayProductos.push(new Producto("PLC",precioPLC,20));
arrayProductos.push(new Producto("Fuente",precioFuente,40));

stock0.innerText = `Stock: ${arrayProductos[0].Stock}`;
stock1.innerText = `Stock: ${arrayProductos[1].Stock}`;
stock2.innerText = `Stock: ${arrayProductos[2].Stock}`;

document.getElementById("add0").addEventListener("click",function(){agregarClick(0);});
document.getElementById("add1").addEventListener("click",function(){agregarClick(1);});
document.getElementById("add2").addEventListener("click",function(){agregarClick(2);});

document.getElementById("clear0").addEventListener("click",function(){vaciarClick(0);});
document.getElementById("clear1").addEventListener("click",function(){vaciarClick(1);});
document.getElementById("clear2").addEventListener("click",function(){vaciarClick(2);});

async function getDolar(){
    const consulta = await fetch("https://api.bluelytics.com.ar/v2/latest");
    const dolar = await consulta.json();
    dolarPrecio = dolar.blue.value_sell;
}
getDolar();

/*----------------------------Para cambiar de moneda entre DOLAR/PESO--------------------------------------------*/ 
const radioButtons = document.querySelectorAll('input[name="moneda"]');
for(const radioButton of radioButtons){
    radioButton.addEventListener('change', function(e) {
        document.getElementById('PESO').checked ? (
            cteMoneda = dolarPrecio
        ) : (
            cteMoneda = 1
        );
        if (this.checked) {
            for(let indice=0;indice<3;indice++){
                document.getElementById('sigSub'+indice).innerText = 'Sub Total: '+this.value;
                document.getElementById('sigIva'+indice).innerText = 'IVA: '+this.value;
                document.getElementById('sigTot'+indice).innerText = 'TOTAL: '+this.value;
                document.getElementById('Precio'+indice).innerText = (this.value)+" "+(precioProducto[indice]*cteMoneda);
                modificarHtml(indice);
            }
        }
      }
    );
}
/*---------------------------------------------------------------------------------------------------------------*/ 

/*----------------------------------------AGREGA ELEMENTOS AL CARRITO--------------------------------------------*/ 
function agregarClick(indice){
    arrayCantidad[indice] = document.getElementById('value'+indice).value;
    arrayProductos[indice].Stock >= arrayCantidad[indice] ? (
        localStorage.setItem(`keyValue${indice}`, arrayCantidad[indice]),
        IVASubTotal[indice] = ((arrayProductos[indice].conIVA())*arrayCantidad[indice]),
        sinIVASubTotal[indice] = ((arrayProductos[indice].sinIVA())*arrayCantidad[indice]),   
        arrayCantidad[indice]=0 
    ) : (
        Swal.fire({
          icon: 'warning',
          text: `¡La cantidad ${arrayCantidad[indice]} supera nuestro stock, ingrese otra cantidad de ${arrayProductos[indice].Producto}!`
        }), 
        arrayCantidad[indice]=0,
        localStorage.removeItem('keyValue'+indice),
        localStorage.removeItem(idProductos[indice]),   
        document.getElementById('input'+indice).innerHTML = `<input type="number" id="value${indice}" class="form-control" placeholder="Cant." min="0" max="${arrayProductos[indice].Stock}" style="width: 4.9rem">`
    );
    //-----OPERADOR AND, solo guarda valores numericos de precios, evita almacenar el NaN
    IVASubTotal[indice] >= 0 && (
        arrayValores[indice] = new Precios( sinIVASubTotal[indice] , IVASubTotal[indice] , (sinIVASubTotal[indice] + IVASubTotal[indice]) ),
        localStorage.setItem(idProductos[indice],JSON.stringify(arrayValores[indice])),
        modificarHtml(indice)
        );   
}
/*--------------------------------------------------------------------------------------------------------------------------------------*/ 

/*------------------------------------------------------ELIMINA ELEMENTOS DEL CARRITO--------------------------------------------------*/ 
function vaciarClick(indice){
    localStorage.removeItem('keyValue'+indice);
    document.getElementById('input'+indice).innerHTML = `<input type="number" id="value${indice}" class="form-control" placeholder="Cant." min="0" max="${arrayProductos[indice].Stock}" style="width: 4.9rem">`;
    document.getElementById('SubTotal'+indice).innerText = '0';
    document.getElementById('Iva'+indice).innerText = '0';
    document.getElementById('Total'+indice).innerText = '0';
    localStorage.removeItem(idProductos[indice]);
  }
/*------------------------------------------------------------------------------------------------------------------------------------*/ 

/*----------------------------------------MODIFICA LO MOSTRADO EN EL HTML, SEGUN LA MONEDA--------------------------------------------*/ 
function modificarHtml(indice){
    //---- SPREAD DE OBJETO
    registroProducto[indice] = {
      ...JSON.parse(localStorage.getItem(idProductos[indice])),
      cantidad: parseInt(localStorage.getItem(keyValues[indice]))
    }
    if(registroProducto[indice].cantidad >= 0){
      document.getElementById('input'+indice).innerHTML = `<input type="number" value="${registroProducto[indice].cantidad }" id="${idValue[indice]}" class="form-control" placeholder="Cant." min="0" max="${arrayProductos[indice].Stock}" style="width: 4.9rem">`;
      document.getElementById('SubTotal'+indice).innerText = ((registroProducto[indice].ValorSubtotal)*cteMoneda).toFixed(2);
      document.getElementById('Iva'+indice).innerText = ((registroProducto[indice].ValorIva)*cteMoneda).toFixed(2);
      document.getElementById('Total'+indice).innerText = ((registroProducto[indice].ValorTotal)*cteMoneda).toFixed(2);
    }
}
/*-----------------------------------------------------------------------------------------------------------------------------------*/ 

/*--------------------Cuando se carga la pestaña, valores por defecto en DOLAR------------------------------------*/ 
document.getElementById('USD').dispatchEvent(new Event('change'));
/*---------------------------------------------------------------------------------------------------------------*/ 
