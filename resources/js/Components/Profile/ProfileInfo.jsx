import { useContext } from "react";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../hooks/usePreferences";

export default function ProfileInfo({ user, isPrivate, followButton }) {
    const preferences = useContext(PreferencesContext);
    const displayEmail = usePreferences(preferences, "display-email");
    const displayDateOfBirth = usePreferences(
        preferences,
        "display-date-of-birth"
    );

    const renderName = () => {
        return (
            (user.first_name || user.last_name) && (
                <div>
                    {user.first_name} {user.last_name}
                </div>
            )
        );
    };

    const renderGender = () => {
        return (
            <div>{user.genders.map((gender) => gender.name).join(", ")}</div>
        );
    };

    const renderPronouns = () => {
        return (
            <div>{user.pronouns.map((pronoun) => pronoun.word).join("/")}</div>
        );
    };

    const renderPrivate = () => {
        if (!isPrivate) return;

        return <div className="error">Private profile</div>;
    };

    const renderEmail = () => {
        if (!displayEmail) return;

        return (
            <div>
                <a href={`mailto:${user.email}`} target="_blank">
                    {user.email}
                </a>
            </div>
        );
    };

    const renderDateOfBirth = () => {
        if (!displayDateOfBirth) return;

        const date = user.date_of_birth;
        const format = new Date(
            date.substring(0, 4),
            +date.substring(5, 7),
            date.substring(8)
        );
        return (
            <div>
                Born {format.getDate()}/{format.getMonth()}/
                {format.getFullYear()}
            </div>
        );
    };

    return (
        <>
            <h2>~{user.nickname}</h2>

            <div style={{ display: "flex" }}>
                <div>
                    {renderName()}
                    {renderEmail()}
                    {renderGender()}
                    {renderPronouns()}
                    {renderDateOfBirth()}
                    {renderPrivate()}
                </div>

                <div style={{ marginLeft: "auto" }}>{followButton(true)}</div>
            </div>
        </>
    );
}
