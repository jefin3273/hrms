import { prisma } from '../lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
    },
  });
}

main().catch((e) => console.error(e));
