<?php

include_once 'Database.php';

class OrderCrud extends Database
{
    public function addOrder($order)
    {
        $query = "INSERT INTO orders (
                    customer_id, company_id, status, total_price, order_date, payment_method, 
                    payment_status, payment_date_time, payment_confirmed_by, slug, 
                    delivery_method, delivery_fee, weight, items_total, order_no
                  ) VALUES (
                    :customer_id, :company_id, :status, :total_price, :order_date, :payment_method, 
                    :payment_status, :payment_date_time, :payment_confirmed_by, :slug, 
                    :delivery_method, :delivery_fee, :weight, :items_total, :order_no
                  )";

        $params = [
            ':customer_id' => $order->customer_id,
            ':company_id' => $order->company_id,
            ':status' => $order->status,
            ':total_price' => $order->total_price,
            ':order_date' => $order->order_date,
            ':payment_method' => $order->payment_method,
            ':payment_status' => $order->payment_status,
            ':payment_date_time' => $order->payment_date_time,
            ':payment_confirmed_by' => $order->payment_confirmed_by,
            ':slug' => $order->slug,
            ':delivery_method' => $order->delivery_method,
            ':delivery_fee' => $order->delivery_fee,
            ':weight' => $order->weight,
            ':items_total' => $order->items_total,
            ':order_no' => 'ORD-0'
        ];

        $this->executeQuery($query, $params);

        $orderId = $this->_conn->lastInsertId();
        $this->createOrderNumber($orderId, $order->prefix ?? 'ORD-');

        return $this->getOrder($orderId);
    }

    private function createOrderNumber($orderId, $prefix)
    {
        $order_no = $prefix . $orderId;
        $query = "UPDATE orders SET order_no = :order_no WHERE id = :id";
        $params = [':order_no' => $order_no, ':id' => $orderId];
        $this->executeQuery($query, $params);
    }

    public function updateOrder($order)
    {
        $query = "UPDATE orders SET 
                    customer_id = :customer_id, 
                    company_id = :company_id, 
                    status = :status, 
                    total_price = :total_price, 
                    order_date = :order_date, 
                    payment_method = :payment_method, 
                    payment_status = :payment_status, 
                    payment_date_time = :payment_date_time, 
                    payment_confirmed_by = :payment_confirmed_by, 
                    slug = :slug, 
                    delivery_method = :delivery_method,
                    delivery_fee = :delivery_fee,
                    weight = :weight,
                    items_total = :items_total
                  WHERE id = :id";

        $params = [
            ':customer_id' => $order->customer_id,
            ':company_id' => $order->company_id,
            ':status' => $order->status,
            ':total_price' => $order->total_price,
            ':order_date' => $order->order_date,
            ':payment_method' => $order->payment_method,
            ':payment_status' => $order->payment_status,
            ':payment_date_time' => $order->payment_date_time,
            ':payment_confirmed_by' => $order->payment_confirmed_by,
            ':slug' => $order->slug,
            ':delivery_method' => $order->delivery_method,
            ':delivery_fee' => $order->delivery_fee,
            ':weight' => $order->weight,
            ':items_total' => $order->items_total,
            ':id' => $order->id
        ];

        $this->executeQuery($query, $params);

        return $this->getOrder($order->id);
    }

    public function listOrders()
    {
        $query = "SELECT * FROM orders";
        $result = $this->executeQuery($query);

        $orders = [];
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $orders[] = $row;
        }

        return $orders;
    }

    public function getOrder($id)
    {
        $query = "SELECT * FROM orders WHERE id = :orderId";
        $params = [':orderId' => $id];
        $result = $this->executeQuery($query, $params);

        if ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            return $row;
        }

        return null;
    }

    public function getOrderByCustomerId($customer_id)
    {
        $query = "SELECT * FROM orders WHERE customer_id = :customer_id";
        $params = [':customer_id' => $customer_id];
        $result = $this->executeQuery($query, $params);

        $orders = [];
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $orders[] = $row;
        }

        return $orders;
    }
}
