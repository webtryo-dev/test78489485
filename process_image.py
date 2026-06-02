from PIL import Image

def process_image(input_path, logo_path, favicon_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if the pixel is near white/light-blue
            # The background in the image seems to be a light color.
            # We'll make anything that's very light (R>230, G>230, B>230) transparent.
            # Or better, the user said the site is white, so we can just extract the blue shapes.
            # The blue shapes are around R=90-120, G=100-140, B=200-250
            if item[0] > 230 and item[1] > 230 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Save as logo
        img.save(logo_path, "PNG")
        
        # Save as favicon (resized to 32x32)
        favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
        favicon.save(favicon_path, format="ICO")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import sys
    process_image(sys.argv[1], sys.argv[2], sys.argv[3])
