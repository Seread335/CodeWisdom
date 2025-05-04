import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { db } from './db';
import { users } from './shared/schema';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, 'admin')
    });

    if (existingAdmin) {
      console.log('Tài khoản admin đã tồn tại');
      return;
    }

    // Tạo tài khoản admin
    const hashedPassword = await hashPassword('admin123456');
    
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      displayName: 'Administrator',
      email: 'admin@itacademy.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Đã tạo tài khoản admin thành công');
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error);
  }
}

createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Lỗi:', error);
    process.exit(1);
  });