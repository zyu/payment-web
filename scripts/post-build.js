const fs = require("fs")
const path = require("path")

// 构建后运行的脚本，确保ad.html和相关图片被正确复制
console.log("Running post-build script to ensure ad.html and images are copied...")

// 检查输出目录中是否存在ad.html
const outDir = path.join(__dirname, "../out")
const adHtmlPath = path.join(outDir, "ad.html")

if (!fs.existsSync(adHtmlPath)) {
  console.log("ad.html not found in output directory, copying from public...")

  // 从public目录复制ad.html
  const publicAdHtmlPath = path.join(__dirname, "../public/ad.html")
  if (fs.existsSync(publicAdHtmlPath)) {
    fs.copyFileSync(publicAdHtmlPath, adHtmlPath)
    console.log("ad.html copied successfully!")
  } else {
    console.error("Error: ad.html not found in public directory!")
  }
}

// 检查images目录
const outImagesDir = path.join(outDir, "images")
const publicImagesDir = path.join(__dirname, "../public/images")

if (!fs.existsSync(outImagesDir) && fs.existsSync(publicImagesDir)) {
  console.log("Creating images directory in output...")
  fs.mkdirSync(outImagesDir, { recursive: true })
}

// 复制public/images中的所有文件到out/images
if (fs.existsSync(publicImagesDir)) {
  const imageFiles = fs.readdirSync(publicImagesDir)

  imageFiles.forEach((file) => {
    const srcPath = path.join(publicImagesDir, file)
    const destPath = path.join(outImagesDir, file)

    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`Copied image: ${file}`)
    }
  })

  console.log("All images copied successfully!")
}

console.log("Post-build script completed!")
