// Data storage
let products = [];
let productNames = new Set();
let currentEditId = null;

// DOM elements
const $btn = document.getElementById("btn-create");
const $nombre = document.getElementById("name");
const $precio = document.getElementById("precio");
const $productTableBody = document.getElementById("product-table-body");

// Handle button click
$btn.addEventListener("click", function () {
    const nameUpper = $nombre.value.toUpperCase();

    // Check empty fields
    if ($nombre.value === "" || $precio.value === "") {
        Swal.fire({ title: "Error", text: "Favor llenar todos los campos.", icon: "error", timer: 2000 });
        return;
    }

    // Check duplicate name (only when not editing)
    if (!currentEditId && productNames.has(nameUpper)) {
        Swal.fire({ title: "Error", text: `El producto ${$nombre.value} ya existe`, icon: "error", timer: 2500 });
        return;
    }

    currentEditId ? updateProduct() : saveProduct();
});

// Save new product
function saveProduct() {
    const nameUpper = $nombre.value.toUpperCase();

    let newProduct = {
        id: products.length + 1,
        name: nameUpper,
        precio: `$ ${$precio.value}`,
    };

    products.push(newProduct);
    productNames.add(nameUpper);
    addRowToTable(newProduct);

    Swal.fire({ position: "top-end", icon: "success", title: "Producto creado correctamente", showConfirmButton: false, timer: 1500 });

    resetForm();
}

// Add row to table
function addRowToTable(product) {
    let row = $productTableBody.insertRow();
    row.insertCell(0).innerHTML = product.id;
    row.insertCell(1).innerHTML = product.name;
    row.insertCell(2).innerHTML = product.precio;

    let cellActions = row.insertCell(3);

    // Delete button
    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Eliminar";
    btnDelete.id = "btn-delete";
    btnDelete.onclick = () => deleteProduct(row, product.id);

    // Edit button
    let btnEdit = document.createElement("button");
    btnEdit.innerText = "Editar";
    btnEdit.id = "btn-update";
    btnEdit.onclick = () => editProduct(product);

    cellActions.appendChild(btnDelete);
    cellActions.appendChild(btnEdit);
}

// Load product data into form for editing
function editProduct(product) {
    $nombre.value = product.name;
    $precio.value = product.precio.replace('$ ', '');
    currentEditId = product.id;
}

// Update existing product
function updateProduct() {
    const nameUpper = $nombre.value.toUpperCase();
    const original = products.find(p => p.id === currentEditId);

    // Avoid duplicate name when editing
    if (original.name !== nameUpper && productNames.has(nameUpper)) {
        Swal.fire({ title: "Error", text: "El nombre del producto ya existe.", icon: "error", timer: 2000 });
        return;
    }

    productNames.delete(original.name);
    productNames.add(nameUpper);

    let updated = {
        id: currentEditId,
        name: nameUpper,
        precio: `$ ${$precio.value}`,
    };

    products = products.map(p => p.id === currentEditId ? updated : p);

    // Update table row
    const row = Array.from($productTableBody.rows).find(r => r.cells[0].innerText == currentEditId);
    row.cells[1].innerText = updated.name;
    row.cells[2].innerText = updated.precio;
    row.cells[3].querySelector("#btn-update").onclick = () => editProduct(updated);

    Swal.fire({ position: "top-end", icon: "success", title: "Producto actualizado correctamente", showConfirmButton: false, timer: 1500 });

    resetForm();
}

// Delete product from list and table
function deleteProduct(row, id) {
    Swal.fire({
        title: "¿SEGURO?",
        text: "¿Desea borrar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí!"
    }).then((result) => {
        if (result.isConfirmed) {
            const productToDelete = products.find(p => p.id === id);
            productNames.delete(productToDelete.name);
            products = products.filter(p => p.id !== id);
            row.remove();

            Swal.fire({ title: "¡ELIMINADO!", text: "Fue eliminado correctamente.", icon: "success" });
        }
    });

    resetForm();
}

// Clear form and reset edit state
function resetForm() {
    $nombre.value = "";
    $precio.value = "";
    currentEditId = null;
}
