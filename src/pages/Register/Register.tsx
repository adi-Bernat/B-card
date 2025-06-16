import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel, Card } from "flowbite-react";
import { useForm, useWatch } from "react-hook-form";
import { registerSchema } from "../../validations/register.joi";
import axios from "axios";
import { useState } from "react";
import { FaUser, FaBriefcase, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type FormData = {
    name: { first: string; middle: string; last: string };
    email: string;
    password: string;
    phone: string;
    address: {
        country: string;
        city: string;
        street: string;
        houseNumber: string;
        zip: string;
    };
    isBusiness: boolean;
    image?: { url: string; alt: string };
};

export default function Register() {
    const [isBusinessUser, setIsBusinessUser] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
        setValue,
        reset,
        control,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            name: { first: "", middle: "", last: "" },
            email: "",
            password: "",
            phone: "",
            address: { country: "", city: "", street: "", houseNumber: "", zip: "" },
            isBusiness: false,
            image: { url: "", alt: "" },
        },
        mode: "onChange",
        resolver: joiResolver(registerSchema),
    });

    const imageUrl = useWatch({ control, name: "image.url" });
    const formData = watch();

    const submitForm = async (data: FormData) => {
        console.log("🔄 Starting registration...");
        console.log("📋 Form data:", data);

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const userData = {
                ...data,
                isBusiness: isBusinessUser,
                name: {
                    first: data.name.first || "",
                    middle: data.name.middle || "",
                    last: data.name.last || ""
                },
                address: {
                    country: data.address.country || "",
                    city: data.address.city || "",
                    street: data.address.street || "",
                    houseNumber: data.address.houseNumber || "",
                    zip: data.address.zip || ""
                },
                image: {
                    url: data.image?.url || "",
                    alt: data.image?.alt || ""
                }
            };

            console.log("📤 Sending registration data:", userData);
            console.log("📋 Data structure check:");
            console.log("- name.first:", userData.name?.first);
            console.log("- name.last:", userData.name?.last);
            console.log("- email:", userData.email);
            console.log("- password:", userData.password ? "EXISTS" : "MISSING");
            console.log("- phone:", userData.phone);
            console.log("- address.country:", userData.address?.country);
            console.log("- address.city:", userData.address?.city);
            console.log("- address.street:", userData.address?.street);
            console.log("- address.houseNumber:", userData.address?.houseNumber);
            console.log("- isBusiness:", userData.isBusiness);

            const response = await axios.post(
                "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
                userData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 15000,
                }
            );

            console.log("Registration successful:", response.data);

            toast.success(" הרשמה הושלמה בהצלחה!");

            setTimeout(() => {
                toast.info(`ברוך הבא ${userData.name.first}! 👋 מעביר אותך לעמוד ההתחברות...`);
            }, 1000);

            reset();
            setIsBusinessUser(false);

            setTimeout(() => {
                toast.success("עבור לעמוד ההתחברות כדי להיכנס לחשבון! 🚀");
                navigate("/signin");
            }, 3000);

        } catch (error) {
            console.error(" Registration error:", error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message;
                    const details = error.response.data?.details;

                    console.log("📋 Error details:", { status, message, details });
                    console.log("📋 Full error response:", error.response?.data);
                    console.log("📋 Request that failed:", error.config?.data);

                    if (error.code === "ECONNABORTED") {
                        toast.error("החיבור לשרת התנתק. אנא נסה שוב.");
                    } else if (status === 400) {
                        if (details) {
                            toast.error(`שגיאה בנתונים: ${details}`);
                        } else {
                            toast.error("שגיאה בנתונים. אנא בדוק את כל השדות.");
                        }
                    } else if (status === 409) {
                        toast.error("משתמש עם אימייל זה כבר קיים במערכת.");
                    } else if (status === 422) {
                        toast.error("שגיאה בתקינות הנתונים. אנא בדוק את הפרטים.");
                    } else if (status >= 500) {
                        toast.error("שגיאה בשרת. אנא נסה מאוחר יותר.");
                    } else {
                        toast.error(`שגיאה: ${message || 'שגיאה לא ידועה'}`);
                    }
                } else if (error.request) {
                    toast.error("אין תשובה מהשרת. אנא בדוק את החיבור לאינטרנט.");
                } else {
                    toast.error("שגיאה בהגדרת הבקשה.");
                }
            } else {
                toast.error("שגיאת רשת. אנא בדוק את החיבור לאינטרנט.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        reset();
        setIsBusinessUser(false);
        toast.info("הטופס אופס");
    };

    const handleBusinessToggle = (business: boolean) => {
        setIsBusinessUser(business);
        setValue("isBusiness", business, { shouldValidate: true });
    };

    // Debug info
    console.log('🔍 Form validation state:', {
        isValid,
        errorsCount: Object.keys(errors).length,
        errors: errors,
        isBusinessUser,
        formData: {
            hasFirstName: !!formData.name?.first,
            hasEmail: !!formData.email,
            hasPassword: !!formData.password,
            hasPhone: !!formData.phone,
        }
    });

    return (
        <main className="flex min-h-screen items-center justify-center bg-emerald-100 dark:bg-gray-800 p-4" dir="rtl">
            <Card className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <FaUser className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">הרשמה</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        צור חשבון חדש במערכת
                    </p>
                </div>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-6" noValidate>
                    {/* User Type Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            סוג המשתמש *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all duration-200 ${!isBusinessUser
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                    }`}
                                onClick={() => handleBusinessToggle(false)}
                            >
                                <FaUser className="mx-auto text-xl mb-2" />
                                <span className="font-semibold">משתמש רגיל</span>
                            </div>
                            <div
                                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all duration-200 ${isBusinessUser
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                    }`}
                                onClick={() => handleBusinessToggle(true)}
                            >
                                <FaBriefcase className="mx-auto text-xl mb-2" />
                                <span className="font-semibold">משתמש עסקי</span>
                            </div>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            פרטים אישיים
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    {...register("name.first")}
                                    label="שם פרטי *"
                                    color={errors.name?.first ? "error" : undefined}
                                />
                                {errors.name?.first && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.first.message}</p>
                                )}
                            </div>
                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    {...register("name.middle")}
                                    label="שם אמצעי"
                                />
                            </div>
                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    {...register("name.last")}
                                    label="שם משפחה *"
                                    color={errors.name?.last ? "error" : undefined}
                                />
                                {errors.name?.last && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.last.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            פרטי התקשרות
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    {...register("email")}
                                    type="email"
                                    label="דוא״ל *"
                                    color={errors.email ? "error" : undefined}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                <FloatingLabel
                                    variant="outlined"
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    label="סיסמה *"
                                    color={errors.password ? "error" : undefined}
                                />
                                <button
                                    type="button"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <FloatingLabel
                                variant="outlined"
                                {...register("phone")}
                                label="טלפון *"
                                type="tel"
                                color={errors.phone ? "error" : undefined}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            כתובת
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingLabel
                                variant="outlined"
                                {...register("address.country")}
                                label="מדינה *"
                                color={errors.address?.country ? "error" : undefined}
                            />
                            <FloatingLabel
                                variant="outlined"
                                {...register("address.city")}
                                label="עיר *"
                                color={errors.address?.city ? "error" : undefined}
                            />
                            <FloatingLabel
                                variant="outlined"
                                {...register("address.street")}
                                label="רחוב *"
                                color={errors.address?.street ? "error" : undefined}
                            />
                            <FloatingLabel
                                variant="outlined"
                                {...register("address.houseNumber")}
                                label="מספר בית *"
                                color={errors.address?.houseNumber ? "error" : undefined}
                            />
                            <FloatingLabel
                                variant="outlined"
                                {...register("address.zip")}
                                label="מיקוד"
                            />
                        </div>
                    </div>

                    {/* Image Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            תמונת פרופיל (אופציונלי)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingLabel
                                variant="outlined"
                                {...register("image.url")}
                                label="כתובת תמונה"
                                type="url"
                            />
                            <FloatingLabel
                                variant="outlined"
                                {...register("image.alt")}
                                label="טקסט חלופי לתמונה"
                            />
                        </div>
                        {imageUrl && (
                            <div className="mt-4 text-center">
                                <img
                                    src={imageUrl}
                                    alt="תמונת תצוגה מקדימה"
                                    className="w-32 h-32 object-cover mx-auto rounded-full border-4 border-gray-200"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        toast.error('שגיאה בטעינת התמונה');
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Debug Info */}
                    <div className="text-xs text-gray-500 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <strong>Debug:</strong>
                        Valid={isValid ? 'כן' : 'לא'} |
                        Errors={Object.keys(errors).length} |
                        Business={isBusinessUser ? 'כן' : 'לא'} |
                        Submitting={isSubmitting ? 'כן' : 'לא'}
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-1">
                                <strong>שגיאות:</strong> {Object.keys(errors).join(', ')}
                            </div>
                        )}
                        <div className="mt-2">
                            <Button
                                type="button"
                                size="xs"
                                color="blue"
                                onClick={() => {
                                    const currentData = watch();
                                    const userData = {
                                        ...currentData,
                                        isBusiness: isBusinessUser,
                                        name: {
                                            first: currentData.name?.first || "",
                                            middle: currentData.name?.middle || "",
                                            last: currentData.name?.last || ""
                                        },
                                        address: {
                                            country: currentData.address?.country || "",
                                            city: currentData.address?.city || "",
                                            street: currentData.address?.street || "",
                                            houseNumber: currentData.address?.houseNumber || "",
                                            zip: currentData.address?.zip || ""
                                        }
                                    };
                                    if (!userData.image?.url) {
                                        userData.image = { url: "", alt: "" };
                                    }
                                    console.log("🧪 Debug Data Structure:", userData);
                                    console.log("🧪 JSON String:", JSON.stringify(userData, null, 2));
                                }}
                            >
                                🔍 Debug Current Data
                            </Button>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                            disabled={!isValid || isSubmitting}
                            size="lg"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    נרשם...
                                </div>
                            ) : (
                                'הירשם'
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleReset}
                            color="gray"
                            disabled={isSubmitting}
                            size="lg"
                        >
                            איפוס
                        </Button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            כבר יש לך חשבון?{" "}
                            <a href="/signin" className="text-blue-600 hover:text-blue-500 font-semibold">
                                התחבר כאן
                            </a>
                        </p>
                    </div>
                </form>
            </Card>
        </main>
    );
}