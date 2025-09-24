import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1️⃣ 관리자 계정
  await prisma.user.upsert({
    where: { email: 'admin@aespa.com' },
    update: {},
    create: {
      id: 'admin001',
      email: 'admin@aespa.com',
      password: hashedPassword,
      name: '관리자',
      nickname: 'admin',
      role: UserRole.ADMIN,
      profileImage: 'https://via.placeholder.com/150',
      point: 0,
    },
  });

  // 2️⃣ 에스파 멤버 계정
  const aespaMembers = [
    { id: 'karina001', email: 'karina@aespa.com', name: 'Karina', nickname: '카리나' },
    { id: 'winter001', email: 'winter@aespa.com', name: 'Winter', nickname: '윈터' },
    { id: 'giselle001', email: 'giselle@aespa.com', name: 'Giselle', nickname: '지젤' },
    { id: 'ningning001', email: 'ningning@aespa.com', name: 'Ningning', nickname: '닝닝' },
  ];

  for (const member of aespaMembers) {
    await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        id: member.id,
        email: member.email,
        password: hashedPassword,
        name: member.name,
        nickname: member.nickname,
        role: UserRole.ARTIST,
        profileImage: 'https://via.placeholder.com/150',
        point: 1000, // 테스트용 포인트
      },
    });
  }

  // 3️⃣ 게시물(Post) 시드
  const posts = [
    {
      title: 'Karina 첫 번째 게시물',
      content: '안녕하세요, 카리나입니다!',
      authorEmail: 'karina@aespa.com',
    },
    {
      title: 'Winter의 일상 공유',
      content: '윈터의 하루 루틴을 공유합니다.',
      authorEmail: 'winter@aespa.com',
    },
    {
      title: 'Giselle 댄스 팁',
      content: '지젤이 알려주는 댄스 팁!',
      authorEmail: 'giselle@aespa.com',
    },
    {
      title: 'Ningning 노래 연습',
      content: '닝닝과 함께하는 노래 연습!',
      authorEmail: 'ningning@aespa.com',
    },
  ];

  for (const post of posts) {
    const author = await prisma.user.findUnique({ where: { email: post.authorEmail } });
    if (!author) continue;

    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: author.id, // foreign key
      },
    });
  }

  console.log('🌱 Seeding 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
