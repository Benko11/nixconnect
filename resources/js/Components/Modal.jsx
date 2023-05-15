import ModalWindow from "@/Styles/ModalWindow";
import Content from "@/Components/Content";

export default function Modal({ title, show, children, onClose }) {
    if (!show) return null;

    return (
        <ModalWindow className="modal">
            <Content size="700px">
                <div
                    style={{
                        maxHeight: "80vh",
                        overflow: "auto",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "600px",

                            backgroundColor: "var(--tertiary-colour)",
                            padding: "1.5rem 2rem",
                            boxShadow:
                                "20px 20px 0 var(--foreground-colour-dark)",
                        }}
                    >
                        {children}
                    </div>

                    <button
                        onClick={onClose}
                        className="link-button mt-4"
                        style={{ color: "var(--primary-colour)" }}
                    >
                        Close
                    </button>
                </div>
            </Content>
        </ModalWindow>
    );
}
