export const dataUrlFromImgUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      let canvas = document.createElement('CANVAS') as HTMLCanvasElement
      let ctx = canvas.getContext('2d')
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.width)
      let dataURl = canvas.toDataURL() // SLOW OPERATION!!!
      resolve(dataURl)
    }
    image.src = url
  })
}
