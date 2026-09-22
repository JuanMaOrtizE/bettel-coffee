import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }

  return value;
}

const connectionString = getRequiredEnvironmentVariable('DATABASE_URL');
const fullName = getRequiredEnvironmentVariable('OWNER_FULL_NAME');
const username = getRequiredEnvironmentVariable('OWNER_USERNAME');
const password = getRequiredEnvironmentVariable('OWNER_PASSWORD');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    console.log(
      `El usuario "${username}" ya existe. No se realizaron cambios.`,
    );
    return;
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      fullName,
      username,
      passwordHash,
      role: Role.OWNER,
    },
  });

  console.log(`OWNER "${username}" creado correctamente.`);
}

try {
  await main();
} catch (error) {
  console.error('No se pudo crear el OWNER inicial.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
