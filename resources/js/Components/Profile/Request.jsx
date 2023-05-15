import TwoColumnResponsive from "@/Styles/TwoColumnResponsive";
import Button from "@/Styles/Button";

export const Request = ({ user, title, onSubmit }) => {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <TwoColumnResponsive>
                    <div>~{user.nickname}</div>

                    <Button>{title}</Button>
                </TwoColumnResponsive>
            </form>
        </div>
    );
};
