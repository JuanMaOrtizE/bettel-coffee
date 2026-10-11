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
const businessName = getRequiredEnvironmentVariable('BUSINESS_NAME');
const businessSlug = getRequiredEnvironmentVariable('BUSINESS_SLUG');
const fullName = getRequiredEnvironmentVariable('OWNER_FULL_NAME');
const username = getRequiredEnvironmentVariable('OWNER_USERNAME');
const password = getRequiredEnvironmentVariable('OWNER_PASSWORD');
const platformAdminFullName = getRequiredEnvironmentVariable(
  'PLATFORM_ADMIN_FULL_NAME',
);
const platformAdminUsername = getRequiredEnvironmentVariable(
  'PLATFORM_ADMIN_USERNAME',
);
const platformAdminPassword = getRequiredEnvironmentVariable(
  'PLATFORM_ADMIN_PASSWORD',
);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const ownerPasswordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  const platformAdminPasswordHash = await argon2.hash(
    platformAdminPassword,
    {
      type: argon2.argon2id,
    },
  );

  await prisma.$transaction(async (transaction) => {
    await transaction.platformAdmin.upsert({
      where: {
        username: platformAdminUsername,
      },
      update: {
        fullName: platformAdminFullName,
      },
      create: {
        fullName: platformAdminFullName,
        username: platformAdminUsername,
        passwordHash: platformAdminPasswordHash,
      },
    });

    const business = await transaction.business.upsert({
      where: {
        slug: businessSlug,
      },
      update: {
        name: businessName,
      },
      create: {
        name: businessName,
        slug: businessSlug,
      },
    });

    await transaction.user.upsert({
      where: {
        businessId_username: {
          businessId: business.id,
          username,
        },
      },
      update: {},
      create: {
        fullName,
        username,
        passwordHash: ownerPasswordHash,
        role: Role.OWNER,
        business: {
          connect: {
            id: business.id,
          },
        },
      },
    });
  });

  console.log(
    `Pathmin, el administrador de plataforma "${platformAdminUsername}", ` +
      `el negocio "${businessName}" y su OWNER "${username}" ` +
      'fueron preparados correctamente.',
  );
}

try {
  await main();
} catch (error) {
  console.error('No se pudo preparar la instalación inicial de Pathmin.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
