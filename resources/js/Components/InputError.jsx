export default function InputError({ message }) {
    return message ? <div className="error">{message}</div> : null;
}
