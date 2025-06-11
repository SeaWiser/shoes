import { StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { User, UserFormValues } from "@models/user";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import Input from "@ui-components/inputs/Input";
import CustomButton from "@ui-components/buttons/CustomButton";
import ProfilePicture from "@screens/profile/components/ProfilePicture";
import { ProfileImage } from "@models/profile";

type ProfileFormProps = {
  user: User;
  submitFormHandler: (values: UserFormValues) => void;
  isLoading: boolean;
  image: ProfileImage;
  setImage: (image: ProfileImage) => void;
};

export default function ProfileForm({
  user,
  submitFormHandler,
  isLoading,
  image,
  setImage,
}: ProfileFormProps) {
  const initialValues = {
    email: user.email,
    fullName: user.fullName,
    location: {
      postalCode: user.location?.postalCode,
      street: user.location?.street,
      city: user.location?.city,
    },
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Le nom est obligatoire"),
    location: Yup.object().shape({
      postalCode: Yup.string()
        .required("Le code postal est obligatoire")
        .min(5, "Le code postal est incorrect")
        .max(5, "Le code postal est incorrect"),
      street: Yup.string().required("L'adresse est obligatoire"),
      city: Yup.string().required("La ville est obligatoire"),
    }),
  });

  return (
    <KeyboardAvoidingView behavior="height">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePicture
          image={image}
          setImage={setImage}
          photoUrl={user?.photoUrl}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitFormHandler}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            handleBlur,
          }) => (
            <>
              <Input
                label="Nom complet"
                maxLength={60}
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={!!errors.fullName && touched.fullName}
                errorText={errors.fullName}
                autoCapitalize="none"
              />
              <Input label="Email" value={values.email} readOnly />
              <Input
                label="Numéro et nom de rue"
                maxLength={120}
                value={values.location.street}
                onChangeText={handleChange("location.street")}
                onBlur={handleBlur("location.street")}
                error={!!errors.location?.street && touched.location?.street}
                errorText={errors.location?.street}
                autoCapitalize="none"
              />
              <Input
                label="Code postal"
                maxLength={5}
                value={values.location.postalCode}
                onChangeText={handleChange("location.postalCode")}
                onBlur={handleBlur("location.postalCode")}
                error={
                  !!errors.location?.postalCode && touched.location?.postalCode
                }
                errorText={errors.location?.postalCode}
                keyboardType="number-pad"
              />
              <Input
                label="Ville"
                maxLength={90}
                value={values.location.city}
                onChangeText={handleChange("location.city")}
                onBlur={handleBlur("location.city")}
                error={!!errors.location?.city && touched.location?.city}
                errorText={errors.location?.city}
                autoCapitalize="words"
              />
              <CustomButton
                text="Valider"
                onPress={handleSubmit}
                isLoading={isLoading}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHT,
  },
  formContainer: {
    paddingHorizontal: spaces.L,
    paddingVertical: spaces.XL,
    backgroundColor: colors.LIGHT,
  },
});
