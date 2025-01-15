const socket = io();

socket.on('products', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $ ${product.price}`;
        productList.appendChild(li);
    });
});

const productForm = document.getElementById('addProductForm');
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };

    socket.emit('createProduct', newProduct);

    form.reset();
});