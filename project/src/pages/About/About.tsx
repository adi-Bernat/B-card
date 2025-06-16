const About = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start px-6 py-12 bg-emerald-100 dark:bg-gray-900">
            <div className="max-w-3xl text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 border-b-4 border-emerald-500 pb-2">
                    עלינו
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    ברוכים הבאים לאתר שלנו! <br />
                    האתר נבנה במטרה לאפשר לעסקים לפרסם כרטיסי ביקור דיגיטליים בצורה פשוטה, נוחה ונגישה.
                    כאן תוכלו לגלוש בין עשרות כרטיסים, לאהוב עסקים שמעניינים אתכם,
                    ולמצוא את נותני השירות המתאימים בדיוק לצרכים שלכם.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    בין אם אתם לקוחות שמחפשים שירות אמין, או בעלי עסקים שמעוניינים להגדיל את החשיפה – אתם במקום הנכון.
                </p>
            </div>
        </div>
    );
};

export default About;
