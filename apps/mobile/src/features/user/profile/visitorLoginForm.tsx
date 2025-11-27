import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { loginWithGoogle } from "@/query/google-login";
import { fetchVisitorData, sendVisitorOtp } from "@/query/sendVisitorOtp";
import {
  type LoginVisitorFormData,
  loginVisitorSchema,
} from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/authStore";
import { setTokenRole } from "@/utils/secureStore";
import Input from "../../../components/inputs/Input";
import { Pressable } from "react-native-gesture-handler";

GoogleSignin.configure({
  webClientId:
    "968676221050-brhretmcqmd0pavpus0rg38vall2fbfp.apps.googleusercontent.com",
});

export default function VisitorLoginForm() {
  const {
    control: visitorControl,
    watch,
    getValues,
    clearErrors,
    formState: { errors: visitorErro, isSubmitting: visitorSubmiting },
  } = useForm<LoginVisitorFormData>({
    resolver: zodResolver(loginVisitorSchema),
    defaultValues: {
      mobile_no: "",
      otp: "",
    },
  });
  const setAuthStoreToken = useAuthStore((state) => state.setToken);


  const [mobile_no, otp] = watch(["mobile_no", "otp"]);

  const onVisitorSubmit = async (data: LoginVisitorFormData) => {
    const response = await fetchVisitorData(data);
    if (response.success) {
      setAuthStoreToken(response.token, response.role);
      await setTokenRole(response.token,response.role);
      return router.back();
    }
    Alert.alert(response.message);
  };

  const handleGoogleSign = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response) && response.data.idToken) {
        const data = {
          name: response.data.user?.name ?? "",
          email: response.data.user.email,
          photo: response.data.user?.photo ?? "",
          id: response.data.user.id,
        };
        const res = await loginWithGoogle(data);
        if (res.success) {
          setAuthStoreToken(res.token, res.role);
          await setTokenRole(res.token,res.role);
          return router.back();
        } else {
          Alert.alert("Something went wrong", "Google login failed");
        }
      } else {
        Alert.alert("Something went wrong", "Google login failed");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign is in progress");
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Play services not available or outdated");
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert("Something went wrong");
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 w-full">
      <Text className="text-2xl font-bold mb-8 text-secondary">
        Login As Visitor
      </Text>

      <View className="w-full max-w-md">
        <Text className="text-lg font-medium text-secondary mb-2">
          Mobile Number :
        </Text>
        <Controller
          control={visitorControl}
          name="mobile_no"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200"
              placeholder="Enter your mobile number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          )}
        />
        {visitorErro.mobile_no && (
          <Text className="text-error text-sm mb-4">
            {visitorErro.mobile_no.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={async () => {
            const mobileNo = getValues("mobile_no");

            clearErrors("mobile_no");
            if (!mobileNo || !/^\d{10}$/.test(mobileNo)) {
              visitorControl.setError("mobile_no", {
                type: "manual",
                message: "Please enter a valid 10-digit mobile number",
              });
              return;
            }

            const response = await sendVisitorOtp({ mobile_no: mobileNo });
            if (response.success) {
              Alert.alert("OTP sent successfully");
            } else {
              console.log(response);
              Alert.alert("Something went wrong");
            }
          }}
          disabled={visitorSubmiting}
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            visitorSubmiting ? "bg-primary-content" : "bg-primary"
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {visitorSubmiting ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        <Text className="text-lg font-medium text-secondary-content mb-2">
          OTP :
        </Text>
        <Controller
          control={visitorControl}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-secondary bg-base-200"
              placeholder="Enter OTP"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {visitorErro.otp && (
          <Text className="text-error text-sm mb-4">
            {visitorErro.otp.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => onVisitorSubmit({ mobile_no, otp })}
          disabled={visitorSubmiting}
          className={`w-full mt-5 p-4 rounded-lg flex items-center justify-center ${
            visitorSubmiting ? "bg-primary-content" : "bg-primary"
          }`}
        >
          <Text className="text-secondary text-lg font-semibold">
            {visitorSubmiting ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="h-10"></View>
      <Pressable onPress={handleGoogleSign}>
        <View className="flex flex-row rounded-lg border-2 border-secondary">
          <View
            style={{
              backgroundColor: "#ffffff",
            }}
            className="flex rounded-l-lg p-4 flex-row items-center justify-center"
          >
            <Image
              style={{ height: 20, width: 20 }}
              source={require("@/assets/images/google_icon-small.png")}
            />
          </View>
          <View className="bg-info p-4 justify-center rounded-r-lg ">
            <Text
              style={{
                color: "#ffffff",
              }}
              className="font-bold text-center ml-2"
            >
              Sign up with Google
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
