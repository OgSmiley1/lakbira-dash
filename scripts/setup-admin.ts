import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

/**
 * Setup admin user with credentials:
 * Username: Dash-M
 * Password: Hamdan1
 */
async function setupAdmin() {
  console.log("🔧 Setting up admin user...");
  
  const db = await getDb();
  
  const username = "Dash-M";
  const password = "Hamdan1";
  const email = "admin@lakbira.com";
  
  // Hash password
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  
  // Check if admin already exists
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.name, username))
    .limit(1);
  
  if (existingAdmin.length > 0) {
    console.log("✅ Admin user already exists, updating password...");
    
    await db
      .update(users)
      .set({
        role: "admin",
        email,
        loginMethod: "password",
      })
      .where(eq(users.name, username));
    
    console.log("✅ Admin password updated successfully!");
  } else {
    console.log("📝 Creating new admin user...");
    
    await db.insert(users).values({
      id: "admin-dash-m",
      name: username,
      email,
      loginMethod: "password",
      role: "admin",
    });
    
    console.log("✅ Admin user created successfully!");
  }
  
  console.log("\n🎉 Admin Setup Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Username: Dash-M");
  console.log("🔑 Password: Hamdan1");
  console.log("🔗 Login URL: /admin/login");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  process.exit(0);
}

setupAdmin().catch((error) => {
  console.error("❌ Error setting up admin:", error);
  process.exit(1);
});

