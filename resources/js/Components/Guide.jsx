import Button from "../Styles/Button";

export default function Guide({
    stages,
    onNext,
    onPrev,
    activeStage,
    onFinish,
}) {
    return (
        <div>
            <div>{stages[activeStage]}</div>

            <div style={{ display: "flex", paddingTop: "1.5rem" }}>
                {activeStage > 0 && <Button onClick={onPrev}>Previous</Button>}
                <div
                    style={{
                        textAlign: "center",
                        flex: 1,
                        alignSelf: "center",
                    }}
                >
                    {activeStage + 1}/{stages.length}
                </div>
                {activeStage + 1 < stages.length ? (
                    <Button onClick={onNext} className="ml-auto">
                        Next
                    </Button>
                ) : (
                    <Button className="ml-auto" onClick={onFinish}>
                        Finish
                    </Button>
                )}
            </div>
        </div>
    );
}
