import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleSongs = [
  {
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    title: 'Love of My Life',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 218,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 482,
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop'
  },
  {
    title: 'Black Dog',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 296,
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop'
  },
  {
    title: 'Money',
    artist: 'Pink Floyd',
    album: 'The Dark Side of the Moon',
    duration: 382,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop'
  },
  {
    title: 'Time',
    artist: 'Pink Floyd',
    album: 'The Dark Side of the Moon',
    duration: 413,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop'
  },
  {
    title: 'Come Together',
    artist: 'The Beatles',
    album: 'Abbey Road',
    duration: 259,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    title: 'Something',
    artist: 'The Beatles',
    album: 'Abbey Road',
    duration: 182,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    title: 'Get Lucky',
    artist: 'Daft Punk',
    album: 'Random Access Memories',
    duration: 247,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    title: 'One More Time',
    artist: 'Daft Punk',
    album: 'Random Access Memories',
    duration: 320,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.songs.deleteMany();

  // Insert sample songs
  for (const song of sampleSongs) {
    await prisma.songs.create({
      data: song
    });
  }

  console.log('✅ Database seeded successfully!');
}

// main()
//   .catch((e) => {
//     console.error('❌ Error seeding database:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   }); 