

export const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    let str = `${r},${g},${b}`
    return str
}

export const RGBToHex = (r = 0, g = 0, b = 0) => {
    // clamp and convert to hex
    let hr = Math.max(0, Math.min(255, Math.round(r))).toString(16);
    let hg = Math.max(0, Math.min(255, Math.round(g))).toString(16);
    let hb = Math.max(0, Math.min(255, Math.round(b))).toString(16);
    return "#" +
        (hr.length<2?"0":"") + hr +
        (hg.length<2?"0":"") + hg +
        (hb.length<2?"0":"") + hb;
}