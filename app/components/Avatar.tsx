import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import styles from "./styles/avatar.module.scss";
interface SchoolLogoProps {
    src?: string;
    alt?: string;
    href?: string;
    customStyle?: React.CSSProperties;
}
const SchoolLogo = ({ src, alt, href, customStyle = {} }: SchoolLogoProps) => {
    const avatarContent = (
        <img src={src} alt={alt} className={styles.container} style={customStyle}>

        </img>
        //     <Avatar className={styles.container} style={customStyle}>
        //         <AvatarImage src={src} alt={alt} />
        //         <AvatarFallback>{alt?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
        //     </Avatar>
    );

    if (href) {
        return (
            <Link href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {avatarContent}
            </Link>
        );
    }

    return avatarContent;
};

export default SchoolLogo;