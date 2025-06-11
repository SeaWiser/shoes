import fs from "fs";
import path from "path";

interface GoogleServicesConfig {
  project_info: {
    project_number: string;
    firebase_url: string;
    project_id: string;
    storage_bucket: string;
  };
  client: Array<{
    client_info: {
      mobilesdk_app_id: string;
      android_client_info: {
        package_name: string;
      };
    };
    oauth_client: any[];
    api_key: Array<{
      current_key: string;
    }>;
    services: {
      appinvite_service: {
        other_platform_oauth_client: any[];
      };
    };
  }>;
  configuration_version: string;
}

const setupGoogleServices = (): void => {
  console.log("🔧 Setting up google-services.json...");

  const googleServicesBase64 = process.env.GOOGLE_SERVICES_JSON_BASE64;

  if (!googleServicesBase64) {
    console.log(
      "⚠️  GOOGLE_SERVICES_JSON_BASE64 not found in environment variables",
    );
    console.log("   Make sure you have created the EAS secret properly");
    return;
  }

  try {
    // Décoder le contenu base64
    const googleServicesJson = Buffer.from(
      googleServicesBase64,
      "base64",
    ).toString("utf-8");

    // Valider que le JSON est correct
    const parsedConfig: GoogleServicesConfig = JSON.parse(googleServicesJson);
    console.log(
      `📱 Setting up for package: ${parsedConfig.client[0]?.client_info.android_client_info.package_name}`,
    );

    // Définir le chemin du fichier
    const filePath = path.join(
      __dirname,
      "..",
      "android",
      "app",
      "google-services.json",
    );

    // Créer le répertoire android/app si nécessaire
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("📁 Created directory:", dir);
    }

    // Écrire le fichier avec formatage
    fs.writeFileSync(filePath, JSON.stringify(parsedConfig, null, 2));
    console.log("✅ google-services.json created successfully at:", filePath);

    // Vérifier que le fichier a été créé correctement
    const fileStats = fs.statSync(filePath);
    console.log(`📊 File size: ${fileStats.size} bytes`);

    // Vérifier les informations critiques
    if (!parsedConfig.project_info?.project_id) {
      throw new Error("Missing project_id in configuration");
    }

    if (!parsedConfig.client?.[0]?.api_key?.[0]?.current_key) {
      throw new Error("Missing API key in configuration");
    }

    console.log("✨ Configuration validated successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error creating google-services.json:", error.message);

      if (error.message.includes("JSON")) {
        console.error("   The base64 content does not contain valid JSON");
      }
    } else {
      console.error("❌ Unknown error:", error);
    }
    process.exit(1);
  }
};

// Exécuter la fonction
setupGoogleServices();
