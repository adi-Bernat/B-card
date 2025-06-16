import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel, Card } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SignInJoiSchema } from "../../validations/SigninSchema.joi";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

type FormData = {
    email: string;
    password: string;
};

export default function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
        resolver: joiResolver(SignInJoiSchema),
    });

    const submitForm = async (data: FormData) => {
        const existingToken = localStorage.getItem('token');
        const existingLoggedIn = localStorage.getItem('isLoggedIn');

        if (existingToken && existingLoggedIn === 'true') {
            toast.info("כבר מחובר! מעביר לעמוד הבית...");
            navigate("/");
            return;
        }

        if (existingToken && existingLoggedIn !== 'true') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('isAdmin');
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }
            );

            const token = response.data?.token || response.data;
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("isLoggedIn", "true");

                if (response.data?.user) {
                    const user = response.data.user;
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false"); // ✅ כאן העדכון
                }

                toast.success("התחברת בהצלחה! 🎉");

                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('לא התקבל טוקן מהשרת');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.response?.data;
                if (error.code === 'ECONNABORTED') {
                    toast.error('החיבור לשרת התנתק. אנא נסה שוב.');
                } else if (status === 400) {
                    toast.error('שגיאה בנתונים. בדוק אימייל וסיסמה.');
                } else if (status === 401) {
                    toast.error('אימייל או סיסמה שגויים.');
                } else if (status === 404) {
                    toast.error('משתמש לא נמצא. הירשם תחילה.');
                } else {
                    toast.error(`שגיאה: ${message || 'שגיאה לא ידועה'}`);
                }
            } else {
                toast.error('שגיאת רשת. בדוק את החיבור.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <main className="flex min-h-screen items-center justify-center bg-emerald-100 dark:bg-gray-800 px-4 py-8" dir="rtl">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <FaUser className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">התחברות</h1>
                    <p className="text-gray-600 dark:text-gray-400">ברוכים השבים! הכניסו את פרטיכם</p>
                </div>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-6" noValidate>
                    {/* Email */}
                    <div>
                        <div className="relative">
                            <FloatingLabel
                                {...register("email")}
                                variant="outlined"
                                label="כתובת אימייל"
                                type="email"
                                color={errors.email ? "error" : undefined}
                                autoComplete="email"
                            />
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <FloatingLabel
                                {...register("password")}
                                variant="outlined"
                                label="סיסמה"
                                type={showPassword ? "text" : "password"}
                                color={errors.password ? "error" : undefined}
                                autoComplete="current-password"
                            />
                            <FaLock className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-6 rounded-lg"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                מתחבר...
                            </div>
                        ) : (
                            'התחבר'
                        )}
                    </Button>

                    {/* Links */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            עדיין אין לך חשבון?
                            <a href="/register" className="text-blue-600 hover:text-blue-500 mr-1 font-semibold">
                                הירשם כאן
                            </a>
                        </p>
                        <p className="text-sm">
                            <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                                שכחת סיסמה?
                            </a>
                        </p>
                    </div>

                    {/* Clear storage */}
                    <div className="text-xs text-red-100 bg-red-500 p-3 rounded-lg">
                        <strong>⚠️ נקה נתונים ישנים:</strong><br />
                        <Button
                            type="button"
                            size="xs"
                            color="light"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                localStorage.removeItem('isLoggedIn');
                                localStorage.removeItem('isAdmin');
                                toast.success('נתונים נוקו! 🔄');
                            }}
                        >
                            🗑️ נקה
                        </Button>
                    </div>

                    {/* Debug info */}
                    <div className="text-xs text-gray-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <strong>💡 לבדיקה:</strong><br />
                        אימייל: <code>dybrnt28@gmail.com</code><br />
                        סיסמה: <code>Aa12345678!</code>
                    </div>
                </form>
            </Card>
        </main>
    );
}
