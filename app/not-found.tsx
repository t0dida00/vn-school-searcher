import NotFoundScreen from "./components/NotFoundScreen";

// Brand-neutral: this page also serves unknown countries. NotFoundScreen adds the brand for known ones.
export const metadata = { title: "Page not found" };

// The look follows the country in the URL (Finland, Vietnam, or a neutral theme); see NotFoundScreen
export default function NotFound() {
    return <NotFoundScreen />;
}
