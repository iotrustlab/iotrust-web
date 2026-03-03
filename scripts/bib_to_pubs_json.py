#!/usr/bin/env python3
import argparse, json, re, sys, os, unicodedata
from collections import defaultdict

def find_matching_brace(text, start):
    """Find the matching closing brace for an opening brace at position start"""
    if text[start] != '{':
        return -1

    depth = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return i
    return -1

def parse_bibtex(text):
    """Parse BibTeX entries handling nested braces properly"""
    entries = []
    pos = 0

    while True:
        # Find next @
        at_pos = text.find('@', pos)
        if at_pos == -1:
            break

        # Find entry type
        match = re.match(r'@(\w+)\s*\{', text[at_pos:])
        if not match:
            pos = at_pos + 1
            continue

        entry_type = match.group(1)
        open_brace = at_pos + match.end() - 1

        # Find matching closing brace
        close_brace = find_matching_brace(text, open_brace)
        if close_brace == -1:
            pos = at_pos + 1
            continue

        # Extract entry body
        body_start = open_brace + 1
        body_text = text[body_start:close_brace]

        # Find key (first part before comma)
        comma_pos = body_text.find(',')
        if comma_pos == -1:
            pos = at_pos + 1
            continue

        key = body_text[:comma_pos].strip()
        fields_text = body_text[comma_pos+1:]

        # Parse fields
        fields = {}
        field_pattern = re.compile(r'(\w+)\s*=\s*', re.M)

        field_matches = list(field_pattern.finditer(fields_text))
        for i, fm in enumerate(field_matches):
            field_name = fm.group(1).lower()
            value_start = fm.end()

            # Find value end (either next field or end of string)
            if i + 1 < len(field_matches):
                value_end = field_matches[i+1].start()
            else:
                value_end = len(fields_text)

            value_text = fields_text[value_start:value_end].strip()

            # Remove trailing comma
            if value_text.endswith(','):
                value_text = value_text[:-1].strip()

            # Remove braces or quotes
            if value_text.startswith('{') and value_text.endswith('}'):
                value_text = value_text[1:-1]
            elif value_text.startswith('"') and value_text.endswith('"'):
                value_text = value_text[1:-1]

            fields[field_name] = value_text.strip()

        fields['ENTRYTYPE'] = entry_type
        fields['ID'] = key
        entries.append(fields)

        pos = close_brace + 1

    return entries

def slugify(s, maxlen=32):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s[:maxlen] or "untitled"

def first_author_lastname(authors):
    if not authors:
        return "anon"
    first = authors.split(' and ')[0].strip()
    if ',' in first:
        return first.split(',')[0].strip().lower().replace(' ', '')
    parts = first.split()
    return parts[-1].lower() if parts else "anon"

def parse_authors(author_str):
    """Parse BibTeX author string into array of names"""
    if not author_str:
        return []

    # Split by ' and '
    authors = author_str.replace('\n', ' ').split(' and ')
    result = []

    for author in authors:
        author = author.strip()
        if not author:
            continue

        # Handle "Last, First" format
        if ',' in author:
            parts = author.split(',', 1)
            last = parts[0].strip()
            first = parts[1].strip() if len(parts) > 1 else ''
            result.append(f"{first} {last}".strip())
        else:
            # Already in "First Last" format
            result.append(author)

    return result

def determine_type(entrytype):
    """Map BibTeX entry type to publication type"""
    entrytype = entrytype.lower()
    if entrytype in ('inproceedings', 'conference'):
        return 'conference'
    elif entrytype in ('article', 'journalarticle'):
        return 'journal'
    elif entrytype in ('techreport', 'unpublished', 'misc'):
        return 'preprint'
    elif entrytype == 'inbook':
        return 'workshop'
    else:
        return 'conference'  # default

def choose_url(fields):
    for k in ('doi', 'url', 'eprint'):
        v = fields.get(k, '').strip()
        if v:
            if k == 'doi' and not v.lower().startswith('http'):
                return f"https://doi.org/{v}"
            return v
    return ""

def parse_keywords(keyword_str):
    """Parse keywords into array"""
    if not keyword_str:
        return []
    raw = re.split(r'[;,]', keyword_str)
    return [t.strip() for t in raw if t.strip()]

def main():
    ap = argparse.ArgumentParser(description="Convert BibTeX → publications.json")
    ap.add_argument("--bib", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    text = open(args.bib, 'r', encoding='utf-8', errors='ignore').read()
    entries = parse_bibtex(text)

    # Wrap in recentPublications object to match website format
    out = []

    for e in entries:
        # Extract year
        year_match = re.findall(r'\d{4}', e.get('year', ''))
        year = int(year_match[0]) if year_match else None

        # Extract title
        title = e.get('title', 'Untitled').strip().rstrip('.')

        # Parse authors
        authors = parse_authors(e.get('author', ''))

        # Determine venue
        venue = (e.get('booktitle') or e.get('journal') or e.get('publisher') or "").strip()

        # Generate ID
        fa = first_author_lastname(e.get('author', ''))
        first_word = title.split()[0] if title.split() else 'paper'
        pid = f"{fa}{year or 'n.d.'}-{slugify(first_word, maxlen=20)}"

        # Get URL
        url = choose_url(e)

        # Parse keywords
        keywords = parse_keywords(e.get('keywords', ''))

        # Determine type
        pub_type = determine_type(e.get('ENTRYTYPE', 'inproceedings'))

        # Build record in website format
        rec = {
            "id": pid,
            "title": title,
            "authors": authors,
            "venue": venue,
            "year": year,
            "type": pub_type,
            "abstract": e.get('abstract', '').strip(),
            "keywords": keywords,
            "url": url,
            "tags": []  # Empty tags array - to be filled manually or by theme assignment
        }

        # Add optional fields if present
        if 'pages' in e:
            rec['pages'] = e['pages']

        if 'volume' in e:
            rec['volume'] = e['volume']

        if 'organization' in e:
            rec['organization'] = e['organization']

        # Add note field as awards if it suggests an award
        if 'note' in e and ('award' in e['note'].lower() or 'finalist' in e['note'].lower()):
            rec['awards'] = [e['note']]

        out.append(rec)

    # Sort by year (descending) and ID
    out = sorted(out, key=lambda r: (-(r["year"] or 0), r["id"]))

    # Write output in the format expected by the website
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump({"recentPublications": out}, fh, indent=2, ensure_ascii=False)

    print(f"Wrote {len(out)} publications to {args.out}")

if __name__ == "__main__":
    main()
