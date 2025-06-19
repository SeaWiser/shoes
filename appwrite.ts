import { Client, Account, Databases, Storage, ID } from "react-native-appwrite";

export interface User {
  $id: string;
  name: string;
  email: string;
}

const client = new Client();

// Utiliser les variables d'environnement
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform("com.yanis52535.projectshoes");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// Fonction de debug pour vérifier la configuration
export const debugConfiguration = () => {
  console.log("🔧 Configuration Appwrite:");
  console.log("Endpoint:", process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT);
  console.log("Project ID:", process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
  console.log("Database ID:", process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID);
  console.log(
    "User Collection ID:",
    process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  );
  console.log(
    "Storage Bucket ID:",
    process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
  );
};

export const testConnection = async () => {
  try {
    const response = await account.get();
    console.log("✅ Connexion Appwrite réussie!", response);

    // Test de la base de données (listDocuments au lieu de list)
    if (
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID &&
      process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID
    ) {
      try {
        const docs = await databases.listDocuments(
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
          [],
        );
        console.log("✅ Collection users accessible, documents:", docs.total);
      } catch (dbError) {
        console.error("❌ Erreur d'accès à la collection users:", dbError);
      }
    } else {
      console.warn("⚠️ DATABASE_ID ou USER_COLLECTION_ID non configuré");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.log("⚠️ Erreur:", error.message);
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      const appwriteError = error as { code: number; message: string };
      console.log("⚠️ Code erreur Appwrite:", appwriteError.code);
      return appwriteError.code === 401;
    }

    console.log("⚠️ Erreur inconnue:", error);
    return false;
  }
};

export default client;
