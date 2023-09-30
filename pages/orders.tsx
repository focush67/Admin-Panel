import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  border: 1px solid #ccc;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

const CartItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap; /* Allow items to wrap to a new line */
`;

const CartItemImage = styled.img`
  height: 4.5rem;
`;

function OrdersComponent() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOrders(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <Layout>
      <OrdersTable>
        <thead>
          <TableRow>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Cart Items</TableHeader>
            <TableHeader>Order Details</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                <CartItemsContainer>
                  {order.userCart.map((item) => (
                    <CartItemImage key={item._id} src={item.coverPhoto} alt={item.title} />
                  ))}
                </CartItemsContainer>
              </TableCell>
              <TableCell>
                <div>
                  <p><b>Name:</b> {order.name}</p>
                  <p><b>Email:</b> {order.email}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </OrdersTable>
    </Layout>
  );
}

export default OrdersComponent;
