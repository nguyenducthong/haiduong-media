import os
import io
import base64
from PIL import Image

def generate_favicons():
    src = "public/images/logo.png"
    if not os.path.exists(src):
        print(f"Error: {src} does not exist!")
        return

    im = Image.open(src).convert("RGBA")
    print(f"Loaded {src}: size={im.size}, mode={im.mode}")

    # 1. favicon.ico (multi-size: 16, 32, 48, 64)
    ico_path = "public/favicon.ico"
    im.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"[OK] Saved {ico_path} ({os.path.getsize(ico_path)} bytes)")

    # 2. favicon.png (192x192)
    png_path = "public/favicon.png"
    im_192 = im.resize((192, 192), Image.Resampling.LANCZOS)
    im_192.save(png_path, format="PNG", optimize=True)
    print(f"[OK] Saved {png_path} ({os.path.getsize(png_path)} bytes)")

    # 3. apple-touch-icon.png (180x180)
    apple_path = "public/apple-touch-icon.png"
    im_180 = im.resize((180, 180), Image.Resampling.LANCZOS)
    im_180.save(apple_path, format="PNG", optimize=True)
    print(f"[OK] Saved {apple_path} ({os.path.getsize(apple_path)} bytes)")

    # 4. favicon.svg
    svg_path = "public/favicon.svg"
    im_128 = im.resize((128, 128), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im_128.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <image width="128" height="128" href="data:image/png;base64,{b64}"/>
</svg>'''
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"[OK] Saved {svg_path} ({os.path.getsize(svg_path)} bytes)")

    print("All favicons successfully generated!")

if __name__ == "__main__":
    generate_favicons()
