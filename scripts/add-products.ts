import { getDb } from '../server/db';
import { products, collections } from '../drizzle/schema';
import { storagePut } from '../server/storage';
import * as fs from 'fs';
import * as path from 'path';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const productsData = [
  {
    name: 'Blue Sky Kaftan',
    nameAr: 'قفطان السماء الزرقاء',
    description: 'Ramadan & EID COLLECTION - Moroccan design with elegant blue embroidery. Perfect for special occasions.',
    descriptionAr: 'مجموعة رمضان والعيد - تصميم مغربي مع تطريز أزرق أنيق. مثالي للمناسبات الخاصة.',
    color: 'blue sky',
    colorAr: 'أزرق سماوي',
    size: 'Free Size',
    length: 58,
    fabric: 'chiffon',
    fabricAr: 'شيفون',
    price: 0, // DM for price
    imageFile: '1000009585.jpg',
    tags: ['ramadan', 'eid', 'moroccan', 'blue', 'elegant']
  },
  {
    name: 'Ocean Blue Kaftan',
    nameAr: 'قفطان المحيط الأزرق',
    description: 'Ramadan & EID COLLECTION - Moroccan design in ocean blue. Free size with 58cm length.',
    descriptionAr: 'مجموعة رمضان والعيد - تصميم مغربي باللون الأزرق المحيطي. مقاس حر بطول 58 سم.',
    color: 'ocean blue',
    colorAr: 'أزرق محيطي',
    size: 'Free Size',
    length: 58,
    fabric: 'chiffon',
    fabricAr: 'شيفون',
    price: 0,
    imageFile: '1000009586.jpg',
    tags: ['ramadan', 'eid', 'moroccan', 'blue']
  }
];

async function uploadImageToS3(imagePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = path.basename(imagePath);
  const result = await storagePut(`products/${fileName}`, imageBuffer, 'image/jpeg');
  return result.url;
}

async function main() {
  console.log('🚀 Starting product upload...');

  const db = await getDb();
  if (!db) {
    console.error('❌ Database not available');
    return;
  }

  // Find or create Ramadan & EID collection
  const existingCollections = await db.select().from(collections).where(eq(collections.nameEn, 'Ramadan & EID Collection')).limit(1);
  
  let collection;
  if (existingCollections.length === 0) {
    console.log('Creating Ramadan & EID Collection...');
    await db.insert(collections).values({
      id: nanoid(),
      nameEn: 'Ramadan & EID Collection',
      nameAr: 'مجموعة رمضان والعيد',
      descriptionEn: 'Exclusive collection for Ramadan and EID celebrations',
      descriptionAr: 'مجموعة حصرية لاحتفالات رمضان والعيد',
      isActive: true
    });
    // Fetch the created collection
    const newCollections = await db.select().from(collections).where(eq(collections.nameEn, 'Ramadan & EID Collection')).limit(1);
    collection = newCollections[0];
  } else {
    collection = existingCollections[0];
  }

  console.log(`✅ Using collection: ${collection.nameEn} (ID: ${collection.id})`);

  // Upload products
  for (const productData of productsData) {
    console.log(`\n📦 Processing: ${productData.name}...`);
    
    const imagePath = `/home/ubuntu/lakbira-dash/temp_products/${productData.imageFile}`;
    
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${imagePath}`);
      continue;
    }

    // Upload image to S3
    console.log('  📤 Uploading image to S3...');
    const imageUrl = await uploadImageToS3(imagePath);
    console.log(`  ✅ Image uploaded: ${imageUrl}`);

    // Insert product into database
    console.log('  💾 Saving product to database...');
    await db.insert(products).values({
      id: nanoid(),
      nameEn: productData.name,
      nameAr: productData.nameAr,
      descriptionEn: productData.description,
      descriptionAr: productData.descriptionAr,
      basePrice: productData.price,
      fabricEn: productData.fabric,
      fabricAr: productData.fabricAr,
      images: JSON.stringify([imageUrl]),
      availableColors: JSON.stringify([productData.color]),
      availableSizes: JSON.stringify([productData.size]),
      collectionId: collection.id,
      isActive: true,
      isFeatured: true
    });

    console.log(`  ✅ Product added: ${productData.name}`);
  }

  console.log('\n🎉 All products uploaded successfully!');
}

main().catch(console.error);

