import React, { useState } from 'react';

const ProductList = () => {
  // State to hold products and their discounts
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 20, discount: 0 },
    { id: 2, name: 'Product 2', price: 30, discount: 0 },
    { id: 3, name: 'Product 3', price: 25, discount: 0 },
  ]);

  // Function to update discount for a product
  const setDiscount = (productId, discount) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, discount } : product
      )
    );
  };

  // Function to calculate total price after applying discount
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach(product => {
      const discountedPrice = product.price - (product.price * product.discount) / 100;
      totalPrice += discountedPrice;
    });
    return totalPrice;
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} -{product.price - (product.price * product.discount) / 100}
            <input
              type="number"
              value={product.discount}
              onChange={e => setDiscount(product.id, parseInt(e.target.value))}
            />
          </li>
        ))}
      </ul>
      <p>Total Price after discount: ${calculateTotalPrice()}</p>
    </div>
  );
};

export default ProductList;
