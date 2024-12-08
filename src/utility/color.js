export  const lightenColor = (color, percent) => {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
  
    // Convert RGB to HSL
    let hsl = rgbToHsl(r, g, b);
  
    // Lighten or darken the color by adjusting the lightness
    hsl.l = hsl.l + percent > 1 ? 1 : hsl.l + percent < 0 ? 0 : hsl.l + percent;
  
    // Convert back to RGB
    let rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  
    // Convert RGB back to hex
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
  
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return { h, s, l };
  }
  
  // Helper function to convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      let hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
  
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
  
  // Helper function to convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  

  export const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      [{ 'font': ['Arial', 'Verdana', 'Times New Roman'] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['image', 'code-block'],
      ['clean'],
    ],
  };