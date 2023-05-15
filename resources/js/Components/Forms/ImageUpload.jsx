import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Window from "@/Components/Window";

export default function ImageUpload({
    uploadMessage,
    dropMessage,
    errorMessage,
    multiple = false,
    mimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/avif",
        "image/webp",
    ],
    maxHeight = 600,
    maxSize = 5,
    onUpload,
    submitted,
    setSubmitted,
}) {
    const [previews, setPreviews] = useState([]);
    const [uploadedPreviews, setUploadedPreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (submitted) {
            setPreviews([]);
            setUploadedPreviews([]);
            setError("");
            setSubmitted(false);
        }
    }, [submitted]);

    useEffect(() => {
        if (previews.length < 1) return;

        process();

        async function process() {
            const uploads = [];
            for (let preview of previews) {
                const { type, size } = preview;
                if (!mimeTypes.includes(type)) {
                    setDragActive(false);
                    setPreviews([]);
                    setError(errorMessage);
                    return;
                }

                if (maxSize > 0) {
                    if (size > maxSize * 1024 * 1024) {
                        setDragActive(false);
                        setError(`Maximum allowed file size is ${maxSize} MB`);
                        setPreviews([]);
                        return;
                    }
                }

                const reader = new FileReader();
                reader.readAsDataURL(preview);

                const result = await new Promise((resolve, reject) => {
                    reader.onload = (e) => {
                        resolve(e.target.result);
                    };

                    reader.onerror = function (error) {
                        reject(error);
                    };
                });

                uploads.push(result);
                if (!multiple) break;
            }

            setUploadedPreviews([...uploads]);

            onUpload(previews);
        }
    }, [previews]);

    const inputFiles = useRef(null);

    const handleFileChange = async (p) => {
        setPreviews(p);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const transferredFiles = e.dataTransfer.files;
        handleFileChange(transferredFiles);

        setDragActive(false);
    };

    const renderDifferentStates = () => {
        if (previews.length > 0) {
            return (
                <WrapperUpload>
                    <Window colour="var(--secondary-colour)" title="Preview">
                        <UploadedFiles style={{ maxHeight: `${maxHeight}px` }}>
                            {uploadedPreviews.map((file) => (
                                <div
                                    key={file}
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        backgroundImage: `url(${file})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "50% 50%",
                                    }}
                                />
                            ))}
                        </UploadedFiles>
                        {multiple && (
                            <div>
                                {previews.length} file
                                {previews.length > 1 && "s"}
                            </div>
                        )}
                    </Window>
                </WrapperUpload>
            );
        }

        if (dragActive) {
            return (
                <WrapperUpload>
                    <InnerLines>
                        <Inner>{dropMessage}</Inner>
                    </InnerLines>
                </WrapperUpload>
            );
        }

        return (
            <Wrapper>
                <InnerLines>
                    <Inner>
                        {error && <div>{error}</div>}
                        <div>{uploadMessage}</div>
                    </Inner>
                </InnerLines>
            </Wrapper>
        );
    };

    return (
        <>
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputFiles.current.click()}
            >
                <input
                    type="file"
                    ref={inputFiles}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e.target.files)}
                    multiple={multiple}
                />
                {renderDifferentStates()}
            </div>
        </>
    );
}

const WrapperUpload = styled.div`
    cursor: pointer;
    background-color: var(--secondary-colour);
    width: 100%;
    padding: 10px;
    color: var(--foreground);
`;

const Wrapper = styled.div`
    cursor: pointer;
    background-color: var(--primary-colour);
    color: #000 !important;
    width: 100%;
    padding: 10px;
`;

const InnerLines = styled.div`
    padding: 2px;
`;

const Inner = styled.div`
    text-align: center;
    padding: 1rem;
`;

const UploadedFiles = styled.div`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
    margin: 0.5rem 0 1rem 0;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;
