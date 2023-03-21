import ColorThief from './node_modules/colorthief/dist/color-thief.mjs';

function calculateVisualWeight(color) {
  // Convert RGB color to HSL color
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = (() => {
  if (d === 0) {
    return 0;
  } else if (max === r) {
    return ((g - b) / d) % 6;
  } else if (max === g) {
    return (b - r) / d + 2;
  } else {
    return (r - g) / d + 4;
  }
  })();
  const hue = Math.round(h * 60);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  // Calculate the visual weight of the color
  const weight = (0.3 * lightness) + (0.7 * saturation);

  return weight;
}

function closeError(){
  $('.error-handling-container').remove(); 
}

document.getElementById('fileInput').addEventListener('change', imageUploaded);


function imageUploaded(event) {

const file = event.target.files[0];

if (file.type === 'image/png' || file.type === 'image/jpeg') {
  const reader = new FileReader();
  reader.addEventListener("load", function () {
  const imageDataUrl = reader.result;
  const imageElement = document.getElementById("image");
  const shaddow = document.querySelector('.shaddow'); 

  imageElement.addEventListener("load", function () {

    $('#cross').remove(); 
    $('.error-handling-container').remove(); 
    shaddow.style.background = 'linear-gradient(transparent 0,rgba(0,0,0,.5) 100%)'; 

    imageElement.style.opacity = '1'; 
 
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(imageElement);
    const palette = colorThief.getPalette(imageElement, 4);
    const sortedColors = palette.slice().sort((a, b) => calculateVisualWeight(b) - calculateVisualWeight(a));
    const secondHighestColor = sortedColors[1];
    const gradient = `linear-gradient(to top, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}), rgb(${secondHighestColor[0]}, ${secondHighestColor[1]}, ${secondHighestColor[2]}))`;
    const element = document.getElementById("gradient");
    element.style.background = gradient;
  });
    imageElement.src = imageDataUrl;
  });
  reader.readAsDataURL(file);

  }else {

    $.ajax({
        url: 'error.html',
        type: 'GET',
        data: {},
        success: function(response) {
            $('.error-handling').html(response);
            document.querySelector('.ok').addEventListener('click', closeError);

        }});

  }
}
