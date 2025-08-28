import { prisma } from '../src/db/prisma';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

async function main() {
  const pass = await bcrypt.hash('Admin123!', 10);
  await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password_hash: pass, role: 'admin' }
  });

  // productos
  const products = await prisma.$transaction(
    Array.from({ length: 50 }).map((_, i) =>
      prisma.products.create({
        data: {
          name: faker.commerce.productName(),
          sku: `SKU-${i + 1}`,
          price: Number(faker.commerce.price({ min: 5, max: 500 })),
          category: faker.commerce.department()
        }
      })
    )
  );

  // customers
  const customers = await prisma.$transaction(
    Array.from({ length: 100 }).map(() =>
      prisma.customers.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        }
      })
    )
  );

  // orders + items
  for (let i = 0; i < 500; i++) {
    const cust = faker.helpers.arrayElement(customers);
    const itemsCount = faker.number.int({ min: 1, max: 5 });
    const orderDate = faker.date.between({ from: '2024-01-01', to: new Date() });
    const payment = faker.helpers.arrayElement(['cash','card','transfer','wallet']);
    const status = faker.helpers.arrayElement(['pending','paid','cancelled']);
    const items = Array.from({ length: itemsCount }).map(() => {
      const p = faker.helpers.arrayElement(products);
      const qty = faker.number.int({ min: 1, max: 4 });
      return { product_id: p.id, quantity: qty, unit_price: p.price };
    });
    const total = items.reduce((s, it) => s + Number(it.unit_price) * it.quantity, 0);

    const order = await prisma.orders.create({
      data: {
        customer_id: cust.id,
        order_date: orderDate,
        status,
        payment_method: payment,
        total_amount: total
      }
    });

    await prisma.$transaction(
      items.map(it =>
        prisma.order_items.create({
          data: { order_id: order.id, product_id: it.product_id, quantity: it.quantity, unit_price: it.unit_price }
        })
      )
    );
  }
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
