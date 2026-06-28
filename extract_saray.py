import PyPDF2
import json
import os
import sys

saray_dir = r'C:\Users\ozan.aslan\Desktop\Sistemler\Saray'
out_dir = r'C:\Users\ozan.aslan\.verdent\verdent-projects\Ozzoai-c348a679\OzzoAluminyumWebsite\src\data'

files = sorted([f for f in os.listdir(saray_dir) if f.endswith('.pdf')])
catalog = []

for fname in files:
    path = os.path.join(saray_dir, fname)
    try:
        with open(path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            text_parts = []
            for i, page in enumerate(reader.pages[:10]):
                try:
                    t = page.extract_text()
                    if t and t.strip():
                        text_parts.append(t.strip())
                except:
                    pass
            full_text = '\n'.join(text_parts)
            entry = {
                'id': fname.replace('.pdf', '').replace(' ', '_').lower(),
                'name': fname.replace('.pdf', ''),
                'brand': 'Saray Aluminyum',
                'pages': num_pages,
                'hasText': len(full_text) > 50,
                'text': full_text[:4000]
            }
            catalog.append(entry)
            status = 'OK' if len(full_text) > 50 else 'GORSEL'
            print(f'{status}: {fname} | {num_pages}s | {len(full_text)}k', flush=True)
    except Exception as e:
        print(f'HATA: {fname} -> {e}', flush=True)

out_path = os.path.join(out_dir, 'sarayCatalog.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print(f'\nTamamlandi: {len(catalog)} katalog -> {out_path}', flush=True)
