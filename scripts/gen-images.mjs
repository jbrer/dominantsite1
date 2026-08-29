import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUT_DIR = '/home/z/my-project/public/images';

const IMAGES = [
  {
    name: 'hero',
    size: '1344x768',
    prompt:
      'Warm modern home interior after renovation: premium oak laminate wood flooring, elegant wooden interior door with matte black hardware, stylish large-format ceramic tiled accent wall in beige tones, soft daylight from big window, plants and minimal scandinavian decor, professional architectural photography, inviting dream home atmosphere, cozy warm amber color palette, high quality, detailed, no people, no text',
  },
  {
    name: 'category-doors',
    size: '1152x864',
    prompt:
      'Showroom display of elegant premium interior doors for home, white painted and natural oak veneer door models side by side, modern matte black handles, soft studio lighting, clean bright showroom walls, professional product photography, warm tones, high quality, detailed, no people, no text',
  },
  {
    name: 'category-tiles',
    size: '1152x864',
    prompt:
      'Luxury ceramic wall and floor tiles in a modern bathroom interior, large format marble-effect beige and terracotta tiles, walk-in shower with glass partition, warm ambient lighting, professional interior photography, high quality, detailed, no people, no text',
  },
  {
    name: 'category-laminate',
    size: '1152x864',
    prompt:
      'Cozy modern living room with premium honey oak laminate wood flooring, realistic wood grain texture clearly visible on the floor planks, warm sunlight from window, minimalist scandinavian furniture, rug and sofa slightly visible, professional interior photography, high quality, detailed, no people, no text',
  },
  {
    name: 'category-kitchen',
    size: '1152x864',
    prompt:
      'Beautiful modern kitchen furniture with warm oak wood facades and stone countertop, kitchen island with pendant lights, evening warm cozy lighting, professional interior photography, high quality, detailed, no people, no text',
  },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const results = [];
  const zai = await ZAI.create();

  for (const img of IMAGES) {
    let ok = false;
    let lastError = null;

    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        console.log(`Generating ${img.name} (${img.size}), attempt ${attempt}...`);
        const response = await zai.images.generations.create({
          prompt: img.prompt,
          size: img.size,
        });

        const base64 = response?.data?.[0]?.base64;
        if (!base64) throw new Error('Empty response');

        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync(`${OUT_DIR}/${img.name}.png`, buffer);
        console.log(`OK: ${img.name}.png (${Math.round(buffer.length / 1024)} KB)`);
        ok = true;
      } catch (e) {
        lastError = e;
        console.error(`Failed: ${e.message}`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }

    results.push({ name: img.name, ok, error: lastError?.message });
  }

  const failed = results.filter((r) => !r.ok);
  console.log('---');
  console.log(`Done. Success: ${results.length - failed.length}/${results.length}`);
  if (failed.length) {
    console.log('FAILED:', failed.map((f) => f.name).join(', '));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
