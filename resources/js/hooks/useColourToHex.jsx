export function useColourToHex(dec) {
    return dec.toString(16).padStart(6, "0");
}
