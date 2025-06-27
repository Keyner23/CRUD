import Swal from "sweetalert2"

let products = []
const $btn = document.getElementById("btn-create")
const $nombre = document.getElementById("name")
const $precio = document.getElementById("precio")
const $productTableBody = document.getElementById("product-table-body")
let currentEditId = null; 

$btn.addEventListener("click", function () {
    if ($nombre.value === "" || $precio.value === "") {
        Swal.fire({
            title: "Error",
            text: "Favor llenar todos los campos.",
            icon: "error",
            timer: 2000
        });
        return;
    }
    if (currentEditId) {
        updateProduct(); 
    } else {
        saveProduct();
    }
});

function saveProduct() {
    let newProduct = {
        id: products.length + 1,
        name: $nombre.value.toUpperCase(),
        precio: `$ ${$precio.value}`,
    }

    products.push(newProduct);
    addRowToTable(newProduct);

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto creado correctamente",
        showConfirmButton: false,
        timer: 1500
    });

    resetForm();
}

function addRowToTable(product) {
    let nuevaFila = $productTableBody.insertRow();

    let cellId = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellPrecio = nuevaFila.insertCell(2);
    let cellAccion = nuevaFila.insertCell(3);

    cellId.innerHTML = product.id;
    cellNombre.innerHTML = product.name;
    cellPrecio.innerHTML = product.precio;

    let btnEliminar = document.createElement("button");
    btnEliminar.innerText = "Eliminar";
    btnEliminar.id="btn-delete"
    btnEliminar.onclick = function () {
        deleteProduct(nuevaFila, product.id);
    };

    let btnUpdate = document.createElement("button");
    btnUpdate.innerText = "Editar";
    btnUpdate.id="btn-update"
    btnUpdate.onclick = () => {
        editProduct(product);
    };

    cellAccion.appendChild(btnEliminar);
    cellAccion.appendChild(btnUpdate);
}

function editProduct(product) {
    $nombre.value = product.name;
    $precio.value = product.precio.replace('$ ', '');
    currentEditId = product.id; 
}

function updateProduct() {
    let updatedProduct = {
        id: currentEditId,
        name: $nombre.value.toUpperCase(),
        precio: `$ ${$precio.value}`,
    };

    
    products = products.map(product => product.id === currentEditId ? updatedProduct : product);

    
    const row = Array.from($productTableBody.rows).find(row => row.cells[0].innerText == currentEditId);
    row.cells[1].innerText = updatedProduct.name;
    row.cells[2].innerText = updatedProduct.precio;

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto actualizado correctamente",
        showConfirmButton: false,
        timer: 1500
    });

    resetForm();
}

function deleteProduct(fila, id) {
    Swal.fire({
        title: "¿SEGURO?",
        text: "Desea borrar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(producto => producto.id !== id);
            fila.remove();
            Swal.fire({
                title: "ELIMINADO!",
                text: "Fue eliminado correctamente.",
                icon: "success"
            });
        }
    });
}

function resetForm() {
    $nombre.value = "";
    $precio.value = "";
    currentEditId = null; 
}
