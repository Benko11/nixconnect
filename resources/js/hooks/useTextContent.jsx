import { v4 as uuidv4 } from "uuid";

export default function useContent(content) {
    if (content == null || content === "") return null;

    return content
        .split("\n")
        .map((item) =>
            item == null || item === "" ? (
                <br key={uuidv4()} />
            ) : (
                <div key={uuidv4()}>{item}</div>
            )
        );
}
