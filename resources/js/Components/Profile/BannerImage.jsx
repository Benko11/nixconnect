import Banner from "../../Styles/Banner";

export default function BannerImage({ path, xOffset, yOffset }) {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Banner path={path} xOffset={xOffset} yOffset={yOffset} />
        </div>
    );
}
