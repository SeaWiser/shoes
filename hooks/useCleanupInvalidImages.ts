import { useEffect } from "react";
import { useAuthStore } from "@store/authStore";
import { useUserById, useUpdateUserProfile } from "@hooks/queries/useUser";

export function useCleanupInvalidImages() {
  const { user } = useAuthStore();
  const { data: userProfile } = useUserById(user?.$id!, {
    enabled: !!user?.$id,
  });
  const updateUserMutation = useUpdateUserProfile();

  useEffect(() => {
    const cleanupInvalidImage = async () => {
      if (!userProfile?.photoUrl || !user?.$id) return;

      try {
        console.log("🔍 Vérification validité image:", userProfile.photoUrl);

        const response = await fetch(userProfile.photoUrl, {
          method: "HEAD",
          cache: "no-cache",
        });

        if (!response.ok) {
          console.log(
            "🧹 Suppression URL image invalide (status:",
            response.status,
            ")",
          );

          await updateUserMutation.mutateAsync({
            documentId: userProfile.$id,
            userId: user.$id,
            photoUrl: "", // ✅ Supprimer l'URL invalide
          });
        } else {
          console.log("✅ Image valide");
        }
      } catch (error) {
        console.warn("⚠️ Erreur vérification image:", error);

        // Si erreur réseau, supprimer aussi l'URL
        console.log("🧹 Suppression URL image inaccessible");

        try {
          await updateUserMutation.mutateAsync({
            documentId: userProfile.$id,
            userId: user.$id,
            photoUrl: "",
          });
        } catch (updateError) {
          console.error("❌ Erreur suppression URL:", updateError);
        }
      }
    };

    // Délai pour éviter de faire la vérification à chaque render
    const timeoutId = setTimeout(cleanupInvalidImage, 1000);

    return () => clearTimeout(timeoutId);
  }, [userProfile?.photoUrl, user?.$id, updateUserMutation]);

  return {
    isCleaningUp: updateUserMutation.isPending,
  };
}
