import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/Styles/Button";
import styled from "styled-components";

export default function Carousel({ images, descriptions }) {
    const [active, setActive] = useState(1);

    function handleNextImage(e) {
        e.stopPropagation();

        setActive((prev) => {
            if (prev === images.length) return 1;
            return ++prev;
        });
    }

    function handlePrevImage(e) {
        e.stopPropagation();

        setActive((prev) => {
            if (prev === 1) return images.length;
            return --prev;
        });
    }

    return (
        <>
            <CarouselContainer>
                <img
                    src={images[active - 1]}
                    alt={`Carousel image`}
                    style={{
                        maxWidth: "100%",
                        width: "auto",
                    }}
                />
                <div>{descriptions[active - 1]}</div>
            </CarouselContainer>

            {images && images.length > 1 && (
                <div
                    style={{
                        display: "flex",
                        padding: "1rem 2rem",
                    }}
                >
                    <Button
                        colour="var(--secondary-colour)"
                        white
                        onClick={handlePrevImage}
                    >
                        Previous
                    </Button>
                    <div
                        style={{
                            textAlign: "center",
                            flex: 1,
                            alignSelf: "center",
                        }}
                    >
                        {active}/{images.length}
                    </div>
                    <Button
                        className="ml-auto"
                        colour="var(--secondary-colour)"
                        white
                        onClick={handleNextImage}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}

const CarouselContainer = styled.div`
    padding: 0.5rem;
    display: flex !important;
    flex-direction: column;
    gap: 1rem;
`;
