import InputError from "@/Components/InputError";

export default function InputErrorInfo({ error, info }) {
    return (
        <div>
            <InputError message={error} />
            {error == null && <div>{info}</div>}
        </div>
    );
}
