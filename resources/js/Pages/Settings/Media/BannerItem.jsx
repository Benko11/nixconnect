import SliderItem from "../../../Styles/SliderItem";

export default function BannerItem({ banner, onSelect, bannerSelections }) {
    return (
        <SliderItem key={banner.name} style={{ cursor: "pointer" }}>
            <input
                type="radio"
                name="banner"
                value={banner.id}
                onChange={() => onSelect(banner.id)}
                checked={bannerSelections[banner.id]}
                style={{ display: "none" }}
            />
            <div
                style={{
                    width: "300px",
                    height: "180px",
                    backgroundImage: `url(/storage/banners/${banner.name})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%",
                }}
                onClick={() => onSelect(banner.id)}
            >
                <div> </div>
            </div>
        </SliderItem>
    );
}
